export class TextProvider {
  /**
   * Generates structured story narrative based on character profile and preferences.
   * @param {Object} characterProfile
   * @param {Object} celestialSignature
   * @param {Object} preferences
   * @returns {Promise<Object>}
   */
  async generateStory(characterProfile, celestialSignature, preferences) {
    throw new Error('generateStory() must be implemented by subclass.');
  }
}
