import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { Asset } from '../models/Asset.js';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');
const REFERENCES_DIR = path.join(UPLOADS_ROOT, 'references');
const PORTRAITS_DIR = path.join(UPLOADS_ROOT, 'portraits');

// Ensure upload directories exist
for (const dir of [UPLOADS_ROOT, REFERENCES_DIR, PORTRAITS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Validates file buffer signatures against known image magic numbers.
 */
export function validateImageMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP: RIFF ... WEBP
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return 'image/webp';
  }

  return false;
}

/** True when assets belong in the database rather than on the local disk. */
function usingDatabase() {
  return config.STORAGE_PROVIDER === 'mongodb';
}

/** Asset ids are generated, never supplied — but they do reach a path join. */
function isSafeAssetId(assetId) {
  return typeof assetId === 'string' && /^(ref|prt)_[a-f0-9-]{36}$/i.test(assetId);
}

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/**
 * Normalises whatever the driver hands back into a Node Buffer.
 *
 * A lean query returns a BSON Binary rather than a Buffer, and a Binary has no
 * `.length` — which silently produces an invalid Content-Length header instead
 * of an obvious failure.
 */
function toBuffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value?.buffer) return Buffer.from(value.buffer);
  return Buffer.from(value);
}

function mimeFromPath(filePath) {
  return MIME_BY_EXT[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

export class StorageService {
  /**
   * Save an uploaded reference photo buffer after magic-byte validation.
   */
  static async saveReferencePhoto(buffer, originalName, mimeType) {
    const verifiedMime = validateImageMagicBytes(buffer);
    if (!verifiedMime) {
      const err = new Error('The uploaded file is not a valid JPEG, PNG, or WebP image.');
      err.code = 'UNSUPPORTED_FILE_TYPE';
      err.isCustomError = true;
      err.statusCode = 415;
      throw err;
    }

    const ext = verifiedMime === 'image/jpeg' ? '.jpg' : verifiedMime === 'image/png' ? '.png' : '.webp';
    const assetId = `ref_${uuidv4()}`;

    if (usingDatabase()) {
      await Asset.create({
        assetId,
        kind: 'reference',
        mimeType: verifiedMime,
        bytes: buffer,
        size: buffer.length,
      });
      return { assetId, filename: assetId, mimeType: verifiedMime };
    }
    const filename = `${assetId}${ext}`;
    const filePath = path.join(REFERENCES_DIR, filename);

    await fs.promises.writeFile(filePath, buffer);

    return {
      assetId,
      filename,
      mimeType: verifiedMime,
      size: buffer.length,
      filePath,
    };
  }

  /**
   * Save a generated portrait image buffer or SVG string.
   */
  static async saveGeneratedPortrait(content, ext = '.png', mimeType = 'image/png') {
    const assetId = `prt_${uuidv4()}`;

    if (usingDatabase()) {
      const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
      await Asset.create({ assetId, kind: 'portrait', mimeType, bytes, size: bytes.length });
      return { assetId, filename: assetId, mimeType };
    }
    const filename = `${assetId}${ext}`;
    const filePath = path.join(PORTRAITS_DIR, filename);

    if (Buffer.isBuffer(content)) {
      await fs.promises.writeFile(filePath, content);
    } else if (typeof content === 'string') {
      await fs.promises.writeFile(filePath, content, 'utf8');
    }

    return {
      assetId,
      filename,
      mimeType,
      filePath,
    };
  }

  /**
   * Get file path for a reference asset ID.
   */
  /**
   * Reads an asset's bytes, wherever they live.
   *
   * The two call sites that need the actual content — serving a portrait and
   * handing a reference photo to the image provider — go through this instead
   * of touching the filesystem, so the storage backend is swappable.
   */
  static async read(assetId, kind) {
    if (usingDatabase()) {
      const asset = await Asset.findOne({ assetId, kind }).lean();
      if (!asset) return null;
      return { buffer: toBuffer(asset.bytes), mimeType: asset.mimeType };
    }

    const filePath = this.#localPath(assetId, kind);
    if (!filePath || !fs.existsSync(filePath)) return null;
    return { buffer: fs.readFileSync(filePath), mimeType: mimeFromPath(filePath) };
  }

  static readReference(assetId) {
    return this.read(assetId, 'reference');
  }

  static readPortrait(assetId) {
    return this.read(assetId, 'portrait');
  }

  /** Resolves an asset to a path on disk. Local storage only. */
  static #localPath(assetId, kind) {
    const dir = kind === 'portrait' ? PORTRAITS_DIR : REFERENCES_DIR;
    if (!isSafeAssetId(assetId)) return null;
    const match = fs.existsSync(dir) && fs.readdirSync(dir).find((name) => name.startsWith(assetId));
    return match ? path.join(dir, match) : null;
  }

  static getReferencePath(assetId) {
    return usingDatabase() ? null : this.#localPath(assetId, 'reference');
  }

  static getPortraitPath(assetId) {
    return usingDatabase() ? null : this.#localPath(assetId, 'portrait');
  }

  static async deleteReferencePhoto(assetId) {
    return this.#remove(assetId, 'reference');
  }

  static async deletePortrait(assetId) {
    return this.#remove(assetId, 'portrait');
  }

  static async #remove(assetId, kind) {
    if (usingDatabase()) {
      const result = await Asset.deleteOne({ assetId, kind });
      return result.deletedCount > 0;
    }

    const filePath = this.#localPath(assetId, kind);
    if (!filePath) return false;
    await fs.promises.unlink(filePath).catch(() => {});
    return true;
  }
}
