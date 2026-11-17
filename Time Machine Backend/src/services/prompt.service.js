const PAST_DISCLAIMER =
  'This is an imaginative, astrology-inspired entertainment reading. It does not claim to prove reincarnation, diagnose personal conditions, or provide verified historical facts.';

const FUTURE_DISCLAIMER =
  'This is speculative fiction set in an imagined 2050. It is not a prediction, a forecast, or advice about your actual future, finances, health, or relationships.';

export class PromptService {
  // ───────────────────────────── Past timeline ─────────────────────────────

  static getStorySystemPrompt() {
    return `You are a master storyteller and mythological archivist for "Time Machine", an imaginative, entertainment-focused web experience.

YOUR ESSENTIAL PRINCIPLES:
1. Treat all output as imaginative, symbolic, astrology-inspired fiction and creative storytelling.
2. NEVER claim or suggest you are discovering real, factual previous lives or proving reincarnation.
3. NEVER attribute real-world suffering, illness, disability, financial trouble, or grief to past-life karma or punishment.
4. Keep the tone dignified, poetic, luminous, and emotionally resonant.
5. Return ONLY a valid JSON object matching the requested schema. No conversational filler or markdown code blocks outside JSON.`;
  }

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
  "disclaimer": "${PAST_DISCLAIMER}"
}`;
  }

  // ──────────────────────────── Future timeline ────────────────────────────

  static getFutureSystemPrompt() {
    return `You are a speculative-fiction writer and futures researcher for "2050", a near-future narrative experience.

YOUR ESSENTIAL PRINCIPLES:
1. Everything you write is openly speculative fiction set in an imagined year 2050. It is never a prediction, forecast, or advice.
2. NEVER make claims about the reader's real future health, lifespan, death, fertility, finances, investments, legal outcomes, or relationships.
3. NEVER name real living people, real companies, real political parties, or real governments as actors in the story.
4. Ground the world in plausible, specific, already-emerging technology. Avoid magic, avoid superpowers, avoid singularity hand-waving.
5. Write with the texture of good literary science fiction: concrete sensory detail, restrained optimism, real trade-offs, and ordinary human moments inside extraordinary systems.
6. Treat the reader as the protagonist in second-person-adjacent third person, using the persona name provided.
7. Return ONLY a valid JSON object matching the requested schema. No conversational filler and no markdown code fences.`;
  }

  static getFutureUserPrompt(futureProfile, celestialSignature, preferences) {
    const ageLine =
      futureProfile.projectedAge !== null && futureProfile.projectedAge !== undefined
        ? `- Approximate age in 2050: ${futureProfile.projectedAge} (${futureProfile.lifeStage})`
        : `- Age unspecified — keep the narrative age-neutral (${futureProfile.lifeStage})`;

    return `Write a vivid, grounded chronicle of one person's life in the year 2050.

PERSONA
- Name used throughout: ${futureProfile.personaName}
- 2050 Archetype: ${futureProfile.archetypeName} — ${futureProfile.archetypeSummary}
- Role / Title: ${futureProfile.roleTitle}
${ageLine}
- Defining tension: ${futureProfile.definingTension}
- Narrative guidance: ${futureProfile.narrativeGuidance}

WORLD
- Habitat: ${futureProfile.habitatName} — ${futureProfile.habitatTagline}
- Habitat texture: ${futureProfile.habitatDescription}
- Primary workspace: ${futureProfile.environment}
- Everyday technologies: ${futureProfile.technologies.join(', ')}
- Sector focus: ${futureProfile.sector}
- Requested tone: ${futureProfile.outlook} (luminous = mostly went right; tempered = hard-won and honestly costed; audacious = big swings and consequences; intimate = one life closely observed)

SYMBOLIC THREAD (use lightly, as motif only — never as astrology fact)
- Star sign motif: ${celestialSignature.selectedSign} (${celestialSignature.element})
- Recurring qualities: ${futureProfile.signalThemes.join(', ')}

REQUIREMENTS
Return a JSON object with exactly this shape:
{
  "title": "A short, confident title for this 2050 life, e.g. The Long Quiet Work",
  "futureSections": {
    "arrival": "2-3 paragraphs. Open on a specific morning in 2050. Put the reader physically inside the habitat — light, sound, temperature, the first thing ${futureProfile.personaName} touches. Establish the world through detail, not exposition.",
    "dailyLife": "2-3 paragraphs on the actual texture of the work: what is hard, what is routine, who they argue with, what the technology does and fails to do.",
    "breakthrough": "2-3 paragraphs on the defining achievement and what it genuinely cost. Include at least one real trade-off or thing that was given up.",
    "connections": "2 paragraphs on the people who matter in 2050 — colleagues, a mentor, someone they are responsible for. Keep it specific and unsentimental.",
    "horizon": "2 paragraphs on what is still unfinished, and what ${futureProfile.personaName} intends to do with the decades after 2050."
  },
  "futureSignalsNarrative": [
    {
      "theme": "A capability or quality this life is built on (e.g. Systems Thinking, Patience, Nerve)",
      "interpretation": "How it shows up concretely in 2050, and the recognisable version of it that exists in the reader's life today."
    },
    {
      "theme": "A second one",
      "interpretation": "Same treatment."
    },
    {
      "theme": "A third one",
      "interpretation": "Same treatment."
    }
  ],
  "presentDayDirective": "One concrete, actionable sentence about something the reader could start this month — framed as an invitation, never as a prophecy or a guarantee.",
  "disclaimer": "${FUTURE_DISCLAIMER}"
}`;
  }

  // ────────────────────────────── Image prompts ─────────────────────────────

  static getImagePrompt(characterProfile, preferences, hasReferencePhoto = false) {
    const framing =
      preferences.portraitFraming === 'full_body'
        ? 'full body portrait'
        : preferences.portraitFraming === 'half_body'
          ? 'half-body cinematic portrait'
          : 'close-up cinematic portrait';
    const style =
      'Cinematic mystical realism, oil-on-canvas texture with volumetric rim lighting, deep midnight indigo and antique gold palette, fine grain, museum lighting';

    if (hasReferencePhoto) {
      return `Use the supplied photograph as the identity reference for the same adult person. Preserve their recognizable facial identity, face shape, proportions, skin tone, eyes, nose, lips, and distinctive facial features as closely as possible. Do not intentionally substitute a different person, beautify the face, change their apparent age, or substantially alter their facial structure. Transform the surrounding scene into a cinematic, historically inspired mystical setting with appropriate costume, lighting, atmosphere, and composition. The character is ${characterProfile.characterName}, serving as ${characterProfile.occupation} in an ancient ${characterProfile.eraName}. Attire: ${characterProfile.clothingDescription}. Background: ${characterProfile.portraitSetting}. Framing: ${framing}. Style: ${style}. No embedded text, logos, or watermarks.`;
    }

    return `A masterpiece ${framing} of ${characterProfile.characterName}, a fictional ${characterProfile.occupation} from an ancient ${characterProfile.eraName}. They embody ${characterProfile.characterTraits.join(', ')}. Attire: ${characterProfile.clothingDescription}. Setting: ${characterProfile.portraitSetting} with celestial constellations glowing softly in the night sky. Mood: contemplative, serene, dignified. Style: ${style}. No embedded text, typography, borders, logos, or watermarks.`;
  }

  static getFutureImagePrompt(futureProfile, preferences, hasReferencePhoto = false) {
    const framing =
      futureProfile.portraitFraming === 'full_body'
        ? 'full body environmental portrait'
        : futureProfile.portraitFraming === 'half_body'
          ? 'half-body environmental portrait'
          : 'tight editorial close-up portrait';

    const styles = {
      holographic_realism:
        'Photoreal cinematic sci-fi, shallow depth of field, volumetric haze, cool cyan key light with warm amber practicals, subtle holographic interface glow, shot on large-format digital',
      clean_solarpunk:
        'Bright optimistic solarpunk realism, natural daylight, living greenery woven through architecture, warm terracotta and sage palette, clean matte surfaces, documentary clarity',
      high_contrast_neon:
        'High-contrast neon-noir, deep blacks, hard magenta and electric cyan rim light, rain-wet reflective surfaces, anamorphic flare, bold graphic composition',
      archival_documentary:
        'Restrained documentary realism, available light, muted desaturated palette, slight film grain, the look of a serious magazine profile photograph',
    };
    const style = styles[futureProfile.aesthetic] || styles.holographic_realism;

    const subject = `${futureProfile.personaName}, ${futureProfile.roleTitle}, photographed in the year 2050 in ${futureProfile.habitatName}`;
    const scene = `Setting: ${futureProfile.environment}. Wearing: ${futureProfile.attire}. Visible technology in frame: ${futureProfile.technologies.join(', ')}.`;
    const mood =
      'Mood: composed, intelligent, mid-career, caught in a real working moment rather than posing. Natural human proportions, believable adult face, no exaggerated features.';

    if (hasReferencePhoto) {
      return `Use the supplied photograph as the identity reference for the same adult person. Preserve their recognizable facial identity, face shape, proportions, skin tone, eyes, nose, lips, and distinctive facial features as closely as possible. Do not intentionally substitute a different person, beautify the face, dramatically change their apparent age, or alter their facial structure. Re-stage the person as ${subject}. ${scene} ${mood} Framing: ${framing}. Style: ${style}. No embedded text, captions, HUD typography, logos, or watermarks.`;
    }

    return `A ${framing} of ${subject}. ${scene} ${mood} They carry ${futureProfile.signalThemes.join(', ').toLowerCase()}. Framing: ${framing}. Style: ${style}. No embedded text, captions, HUD typography, logos, or watermarks.`;
  }

  static get PAST_DISCLAIMER() {
    return PAST_DISCLAIMER;
  }

  static get FUTURE_DISCLAIMER() {
    return FUTURE_DISCLAIMER;
  }
}
