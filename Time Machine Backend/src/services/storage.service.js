import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

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
  static getReferencePath(assetId) {
    if (!assetId || typeof assetId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(assetId)) {
      return null;
    }

    const files = fs.readdirSync(REFERENCES_DIR);
    const matched = files.find((f) => f.startsWith(assetId));
    return matched ? path.join(REFERENCES_DIR, matched) : null;
  }

  /**
   * Get file path for a portrait asset ID.
   */
  static getPortraitPath(assetId) {
    if (!assetId || typeof assetId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(assetId)) {
      return null;
    }

    const files = fs.readdirSync(PORTRAITS_DIR);
    const matched = files.find((f) => f.startsWith(assetId));
    return matched ? path.join(PORTRAITS_DIR, matched) : null;
  }

  /**
   * Delete reference photo by asset ID.
   */
  static async deleteReferencePhoto(assetId) {
    const filePath = this.getReferencePath(assetId);
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  /**
   * Delete portrait by asset ID.
   */
  static async deletePortrait(assetId) {
    const filePath = this.getPortraitPath(assetId);
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
