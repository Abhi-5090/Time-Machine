/**
 * Contract for portrait generation.
 *
 * Implementations return a persisted asset descriptor rather than raw bytes so
 * that storage policy (local disk vs. object store) stays in one place.
 */
export class ImageProvider {
  /**
   * Past-life portrait.
   * @param {Object} characterProfile
   * @param {Object} preferences
   * @param {string|null} referenceAssetId Consented reference photo, if any.
   * @returns {Promise<{ assetId: string, filename: string, mimeType: string }>}
   */
  async generatePortrait(characterProfile, preferences, referenceAssetId = null) {
    throw new Error('generatePortrait() must be implemented by subclass.');
  }

  /**
   * 2050 portrait.
   * @param {Object} futureProfile
   * @param {Object} preferences
   * @param {string|null} referenceAssetId
   * @returns {Promise<{ assetId: string, filename: string, mimeType: string }>}
   */
  async generateFuturePortrait(futureProfile, preferences, referenceAssetId = null) {
    throw new Error('generateFuturePortrait() must be implemented by subclass.');
  }
}
