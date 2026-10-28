export class ImageProvider {
  /**
   * Generates or edits portrait image based on character profile and optional reference photo.
   * @param {Object} characterProfile
   * @param {Object} preferences
   * @param {string|null} referenceAssetId
   * @returns {Promise<{ assetId: string, filename: string, mimeType: string }>}
   */
  async generatePortrait(characterProfile, preferences, referenceAssetId = null) {
    throw new Error('generatePortrait() must be implemented by subclass.');
  }
}
