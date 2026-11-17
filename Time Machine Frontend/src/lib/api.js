/*
 * Same-origin by default: in development Vite proxies /api, and in production
 * the host rewrites it to the API service. That keeps every request first-party,
 * so there is no CORS preflight and no cross-site cookie question.
 *
 * VITE_API_BASE_URL overrides it when the API must be called directly — in that
 * case the API's CLIENT_ORIGIN has to list this site's domain.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const TOKEN_KEY = 'tm.reading_tokens';

/* ── Owner tokens ─────────────────────────────────────────────────────────
   A reading is owned by whoever holds its token. We keep tokens in
   localStorage so a reader can come back to their own readings, and every
   access is wrapped because storage throws in private windows.              */

function readTokenMap() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeTokenMap(map) {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(map));
  } catch {
    /* Storage unavailable — the session still works, it just will not persist. */
  }
}

export function getStoredOwnerToken(readingId) {
  return readTokenMap()[readingId] || null;
}

export function saveOwnerToken(readingId, token) {
  const map = readTokenMap();
  map[readingId] = token;
  writeTokenMap(map);
}

export function removeOwnerToken(readingId) {
  const map = readTokenMap();
  delete map[readingId];
  writeTokenMap(map);
}

/* ── Request plumbing ─────────────────────────────────────────────────── */

export class ApiError extends Error {
  constructor(message, { code = 'REQUEST_FAILED', status = 0, details = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.headers || {}) },
    });
  } catch (networkError) {
    throw new ApiError('Could not reach the server. Check your connection and try again.', {
      code: 'NETWORK_ERROR',
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.error?.message || `Request failed with status ${response.status}`, {
      code: data?.error?.code || 'REQUEST_FAILED',
      status: response.status,
      details: data?.error?.details || [],
    });
  }

  return data;
}

function tokenHeaders(readingId, explicitToken) {
  const token = explicitToken || getStoredOwnerToken(readingId);
  return token ? { 'X-Reading-Token': token } : {};
}

/* ── Public surface ───────────────────────────────────────────────────── */

export const api = {
  getHealth() {
    return request('/health');
  },

  /** Every option both wizards can offer, straight from the validator's source of truth. */
  getCatalog() {
    return request('/catalog');
  },

  validateZodiac(payload) {
    return request('/zodiac/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async uploadReferencePhoto(file, photoConsent = true) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photoConsent', String(photoConsent));

    return request('/portraits/reference', { method: 'POST', body: formData });
  },

  deleteReferencePhoto(assetId) {
    return request(`/portraits/reference/${assetId}`, { method: 'DELETE' });
  },

  /**
   * Starts a reading on either timeline. Returns as soon as the job is queued;
   * the caller polls `getReading` for progress.
   */
  async createReading(payload, ownerToken = null) {
    const res = await request('/readings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ownerToken ? { 'X-Reading-Token': ownerToken } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (res?.data?.readingId && res?.data?.ownerToken) {
      saveOwnerToken(res.data.readingId, res.data.ownerToken);
    }

    return res;
  },

  getReading(readingId, ownerToken = null) {
    return request(`/readings/${readingId}`, {
      method: 'GET',
      headers: tokenHeaders(readingId, ownerToken),
    });
  },

  retryReading(readingId, ownerToken = null) {
    return request(`/readings/${readingId}/retry`, {
      method: 'POST',
      headers: tokenHeaders(readingId, ownerToken),
    });
  },

  async deleteReading(readingId, ownerToken = null) {
    const res = await request(`/readings/${readingId}`, {
      method: 'DELETE',
      headers: tokenHeaders(readingId, ownerToken),
    });
    removeOwnerToken(readingId);
    return res;
  },
};
