const API_BASE = '/api/v1';

export function getStoredOwnerToken(readingId) {
  try {
    const tokens = JSON.parse(localStorage.getItem('reading_tokens') || '{}');
    return tokens[readingId] || null;
  } catch {
    return null;
  }
}

export function saveOwnerToken(readingId, token) {
  try {
    const tokens = JSON.parse(localStorage.getItem('reading_tokens') || '{}');
    tokens[readingId] = token;
    localStorage.setItem('reading_tokens', JSON.stringify(tokens));
  } catch {
    // Ignore storage errors
  }
}

export function removeOwnerToken(readingId) {
  try {
    const tokens = JSON.parse(localStorage.getItem('reading_tokens') || '{}');
    delete tokens[readingId];
    localStorage.setItem('reading_tokens', JSON.stringify(tokens));
  } catch {
    // Ignore storage errors
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed with status ${response.status}`);
    error.code = data?.error?.code || 'REQUEST_FAILED';
    error.status = response.status;
    error.details = data?.error?.details || [];
    throw error;
  }

  return data;
}

export const api = {
  async getHealth() {
    return request('/health');
  },

  async validateZodiac(payload) {
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

    const response = await fetch(`${API_BASE}/portraits/reference`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data?.error?.message || 'Failed to upload photo.');
      error.code = data?.error?.code || 'UPLOAD_FAILED';
      throw error;
    }
    return data;
  },

  async deleteReferencePhoto(assetId) {
    return request(`/portraits/reference/${assetId}`, {
      method: 'DELETE',
    });
  },

  async createReading(payload, ownerToken = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (ownerToken) {
      headers['X-Reading-Token'] = ownerToken;
    }

    const res = await request('/readings', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (res?.data?.readingId && res?.data?.ownerToken) {
      saveOwnerToken(res.data.readingId, res.data.ownerToken);
    }

    return res;
  },

  async getReading(readingId, ownerToken = null) {
    const token = ownerToken || getStoredOwnerToken(readingId);
    const headers = {};
    if (token) {
      headers['X-Reading-Token'] = token;
    }

    return request(`/readings/${readingId}`, {
      method: 'GET',
      headers,
    });
  },

  async retryReading(readingId, ownerToken = null) {
    const token = ownerToken || getStoredOwnerToken(readingId);
    const headers = {};
    if (token) {
      headers['X-Reading-Token'] = token;
    }

    return request(`/readings/${readingId}/retry`, {
      method: 'POST',
      headers,
    });
  },

  async deleteReading(readingId, ownerToken = null) {
    const token = ownerToken || getStoredOwnerToken(readingId);
    const headers = {};
    if (token) {
      headers['X-Reading-Token'] = token;
    }

    const res = await request(`/readings/${readingId}`, {
      method: 'DELETE',
      headers,
    });

    removeOwnerToken(readingId);
    return res;
  },
};
