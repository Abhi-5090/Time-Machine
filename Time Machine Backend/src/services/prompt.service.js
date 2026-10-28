export class PromptService {
  /**
   * System developer instructions for OpenAI text model.
   */
  static getStorySystemPrompt() {
    return `You are a master storyteller and mythological archivist for "Mystical Past-Life Astrology", an imaginative, entertainment-focused web experience.

YOUR ESSENTIAL PRINCIPLES:
1. Treat all output as imaginative, symbolic, astrology-inspired fiction and creative storytelling.
2. NEVER claim or suggest you are discovering real, factual previous lives or proving reincarnation.
3. NEVER attribute real-world suffering, illness, disability, financial trouble, or grief to past-life karma or punishment.
4. Keep the tone dignified, poetic, luminous, and emotionally resonant.
5. Return ONLY a valid JSON object matching the requested schema. No conversational filler or markdown code blocks outside JSON.`;
  }

  /**
   * User prompt for OpenAI text model with character profile & preferences.
   */
  static getStoryUserPrompt(characterProfile, celestialSignature, preferences) {
    return `Please write a richly atmospheric fictional past-life story based on this character profile and celestial signature:

CHARACTER PROFILE:
- Character Name: ${characterProfile.characterName}
- Archetype: ${characterProfile.archetypeName} (${characterProfile.archetypeId})
- Fictional Era: ${characterProfile.eraName} (${characterProfile.era})
- Setting: ${characterProfile.setting}
- Occupation/Role: ${characterProfile.occupation}
- Core Traits: ${characterProfile.characterTraits.join(', ')}
- Core Conflict: ${characterProfile.coreConflict}
- Turning Point: ${characterProfile.turningPoint}
- Visual/Clothing Motifs: ${characterProfile.clothingDescription}

CELESTIAL SIGNATURE:
- Selected Sign: ${celestialSignature.selectedSign}
- Element: ${celestialSignature.element}
- Symbolic Themes: ${celestialSignature.symbolicThemes.join(', ')}
- Preferred Theme: ${preferences.mainTheme || 'Wisdom'}
- Story Genre: ${preferences.storyGenre || 'Reflective'}

REQUIREMENTS:
Return a JSON object with this exact shape:
{
  "title": "A poetic fictional title, e.g. The Guardian of the Solstice Gate",
  "storySections": {
    "origins": "2-3 rich paragraphs detailing where this fictional soul emerged, their early calling, and childhood under the stars.",
    "dailyLife": "2-3 rich paragraphs immersing the reader in their duties, craftsmanship, or sacred observances.",
    "turningPoint": "2-3 rich paragraphs detailing a moment of profound moral choice or celestial event that tested their convictions.",
    "relationships": "2 paragraphs on the deep friendships, mentors, or kindred bonds that illuminated their path.",
    "conclusion": "2 paragraphs detailing their lasting peace, wisdom bequeathed to the realm, and quiet legacy."
  },
  "symbolicKarmicThemes": [
    {
      "theme": "A core virtue (e.g. Courage, Discernment, Stewardship)",
      "interpretation": "A gentle, uplifting reflection connecting this symbolic theme to the present journey without making factual past-life claims."
    },
    {
      "theme": "A second virtue",
      "interpretation": "Another reflective contemplation on balance and grace."
    }
  ],
  "presentDayReflection": "A single contemplative question inviting self-reflection today.",
  "disclaimer": "This is an imaginative, astrology-inspired entertainment reading. It does not claim to prove reincarnation, diagnose personal conditions, or provide verified historical facts."
}`;
  }

  /**
   * Builds the image generation prompt.
   * If hasReferencePhoto is true, incorporates the exact mandatory facial preservation directive.
   */
  static getImagePrompt(characterProfile, preferences, hasReferencePhoto = false) {
    const framing = preferences.portraitFraming === 'full_body' ? 'full body portrait' : 'close-up cinematic portrait';
    const style = 'Cinematic mystical realism, 8k resolution, oil on canvas feel with volumetric rim lighting, deep midnight indigo and antique gold palette';

    if (hasReferencePhoto) {
      return `Use the supplied photograph as the identity reference for the same adult person. Preserve their recognizable facial identity, face shape, proportions, skin tone, eyes, nose, lips, and distinctive facial features as closely as possible. Do not intentionally substitute a different person, beautify the face, change their apparent age, or substantially alter their facial structure. Transform the surrounding scene into a cinematic, historically inspired mystical setting with appropriate costume, lighting, atmosphere, and composition. The character is ${characterProfile.characterName}, serving as ${characterProfile.occupation} in an ancient ${characterProfile.eraName}. Attire: ${characterProfile.clothingDescription}. Background: ${characterProfile.portraitSetting}. Framing: ${framing}. Style: ${style}. No embedded text, logos, or watermarks.`;
    }

    return `A masterpiece ${framing} of ${characterProfile.characterName}, a fictional ${characterProfile.occupation} from an ancient ${characterProfile.eraName}. They embody ${characterProfile.characterTraits.join(', ')}. Attire: ${characterProfile.clothingDescription}. Setting: ${characterProfile.portraitSetting} with celestial constellations glowing softly in the night sky. Mood: contemplative, serene, dignified. Style: ${style}. No embedded text, typography, borders, logos, or watermarks.`;
  }
}
