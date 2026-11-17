/**
 * Contract for narrative generation.
 *
 * Both timelines go through one provider so that swapping `AI_PROVIDER_MODE`
 * swaps past and future generation together and they can never drift apart.
 */
export class TextProvider {
  /**
   * Generates the past-life narrative.
   * @param {Object} characterProfile
   * @param {Object} celestialSignature
   * @param {Object} preferences
   * @returns {Promise<{title: string, storySections: Object, symbolicKarmicThemes: Array, presentDayReflection: string, disclaimer: string}>}
   */
  async generateStory(characterProfile, celestialSignature, preferences) {
    throw new Error('generateStory() must be implemented by subclass.');
  }

  /**
   * Generates the 2050 chronicle.
   * @param {Object} futureProfile
   * @param {Object} celestialSignature
   * @param {Object} preferences
   * @returns {Promise<{title: string, futureSections: Object, futureSignalsNarrative: Array, presentDayDirective: string, disclaimer: string}>}
   */
  async generateFuture(futureProfile, celestialSignature, preferences) {
    throw new Error('generateFuture() must be implemented by subclass.');
  }
}
