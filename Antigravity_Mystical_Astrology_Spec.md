# Mystical Past-Life Astrology --- Complete Application Specification & Antigravity Build Prompt

**Document type:** Product Requirements Document (PRD) + Technical
Specification + AI Coding Agent Instructions\
**Project status:** Ready for implementation planning and MVP
development\
**Version:** 1.0\
**Primary stack:** React.js, Node.js, Express.js, MongoDB\
**Working product name:** Mystical Past-Life Astrology\
**Name note:** Treat this as a placeholder. Keep product name, logo,
theme colors, typography, and other branding values centralized so they
can be changed later.

------------------------------------------------------------------------

## 0. Instructions to the Antigravity Coding Agent

You are the lead full-stack engineer, product designer, and QA engineer
responsible for implementing this application.

### Mandatory working rules

1.  **Read this entire Markdown file before changing or creating project
    files.**
2.  Treat this document as the source of truth for the product scope and
    technical requirements.
3.  Inspect the existing folder and repository before making changes.
    Preserve useful existing work and conventions unless they conflict
    with this specification.
4.  If the folder is empty, scaffold the application using the stack and
    folder structure in this document.
5.  Build a complete, functional application---not just a landing page,
    static mockup, or collection of disconnected screens.
6.  Implement the frontend, backend, database models, validation, error
    handling, and documented API contracts.
7.  Keep secrets and AI provider credentials on the server. Never expose
    API keys in React code or commit them to source control.
8.  Do not pretend an integration works if credentials are missing.
    Provide a clearly labeled demo/mock mode that works locally and
    document how to configure real providers.
9.  Do not fabricate astrology calculations or present an invented
    past-life story as factual history.
10. The app is a **mystical, astrology-inspired entertainment and
    storytelling experience**. It must not claim to prove reincarnation,
    discover an objectively real past life, diagnose a user, or explain
    real-life suffering as karmic punishment.
11. Use reusable components, consistent naming, maintainable modules,
    and readable code. Avoid giant components and duplicated business
    logic.
12. Implement responsive layouts for mobile, tablet, and desktop, plus
    loading, empty, error, and success states.
13. Run the available tests, linting, type/build checks, and fix
    failures before reporting completion.
14. Do not silently omit a requirement. If a requirement cannot be
    completed because credentials, an external service, or an
    unsupported capability is missing, implement the surrounding
    interface and contract, document the blocker, and provide exact
    setup instructions.
15. Implement the selected brand palette, **Celestial Royalty**, exactly as specified in Section 11.2. Centralize every color as design tokens/CSS variables; do not scatter hex values through components. Keep the tokens easy to change later, but do not leave placeholder colors.
16. After implementation, provide a concise summary of what works, how
    to run it, environment variables needed, tests performed, and any
    known limitations.
17. **Use the OpenAI API for live AI generation when configured.** Keep `OPENAI_API_KEY` exclusively on the backend. Use OpenAI image generation/editing with a user-supplied reference photo when consented, and prioritize facial identity preservation. Never promise perfect identity preservation: image models can alter facial details. Explain this honestly in the UI and allow preview/regeneration.
18. **Deliver the reading report as a beautifully designed image artifact.** Render actual story text using HTML/CSS and export high-resolution PNG/JPEG (and PDF if supported). Do not ask the image model to render the report text into an image; programmatic layout is required for legible, accurate text.

### Required implementation sequence

-   Phase A: Inspect repository and summarize the implementation plan.
-   Phase B: Scaffold frontend, backend, shared configuration, and
    development scripts.
-   Phase C: Implement the design system and primary user journeys.
-   Phase D: Implement API routes, validation, services, and MongoDB
    models.
-   Phase E: Implement the deterministic mystical interpretation engine.
-   Phase F: Implement OpenAI text/image provider adapters with mock
    fallbacks, including consent-based reference-photo editing and
    explicit identity-preservation safeguards.
-   Phase G: Implement results, designed image-report export, PDF export
    where supported, sharing, privacy controls, and error states.
-   Phase H: Add automated tests, security checks, documentation, and
    final verification.

Do not stop after Phase A. Continue through the implementation unless a
genuine blocking decision requires clarification.

------------------------------------------------------------------------

# 1. Product Overview

## 1.1 Product vision

Build a premium-feeling mystical astrology web application where users
provide a small set of birth details and preferences to receive a
personalized **imagined past-life reading**, a fictional character
identity, and a matching portrait.

The experience should feel like entering a celestial reading
ritual---not like using a generic AI image generator.

The AI models are implementation details. User-facing language should
emphasize the reading, symbolism, story, and portrait rather than
technical AI terminology.

## 1.2 Core value proposition

"Explore a mystical, astrology-inspired story of who you might imagine
yourself to have been in another time---with a personalized character
portrait and reflective soul themes."

Use language such as: - "Your imagined past-life reading" - "Your
symbolic soul archetype" - "Explore the story inspired by your selected
zodiac symbolism" - "Your fictional past-life portrait" - "A reflection
for your present journey"

Do **not** use factual or certainty claims such as: - "We have
discovered your actual previous life." - "Your birth chart proves you
were a king." - "Your current illness, fear, relationship, or financial
problem is caused by past-life karma." - "This portrait is what you
truly looked like in a previous life."

## 1.3 Target users

-   Users interested in astrology, zodiac symbolism, spirituality,
    fantasy storytelling, and personalized portraits.
-   Users who enjoy shareable, visually engaging entertainment
    experiences.
-   Users who want a short reading or a longer downloadable report.

## 1.4 Product principles

1.  Mystical and emotionally engaging, but transparent.
2.  Personalized without pretending to know unverifiable facts.
3.  Visual-first, with a coherent portrait and narrative.
4.  Accessible and mobile-friendly.
5.  Privacy-conscious, especially for birth information and face photos.
6.  Cost-aware, with generation limits and provider adapters.
7.  Consistent: the story, character profile, and image must describe
    the same fictional character.

------------------------------------------------------------------------

# 2. Scope and Release Plan

## 2.1 MVP features --- must implement

-   Premium mystical landing page.
-   Responsive multi-step onboarding.
-   Birth date and/or manually selected symbolic zodiac sign.
-   Clear zodiac mismatch handling.
-   Mystical Zodiac mode as the default interpretation mode.
-   Optional birth time and birthplace.
-   Archetype, theme, reading-depth, language, and portrait-style
    selections.
-   Optional reference photo upload with explicit consent.
-   Consent and privacy messaging.
-   Deterministic interpretation rules and archetype library.
-   Structured fictional character profile generation.
-   AI text generation through a server-side provider adapter.
-   AI portrait generation through a server-side provider adapter.
-   Functional mock mode when provider credentials are not configured.
-   Results page with portrait and reading sections.
-   Reading history only if a user/account mechanism is implemented;
    otherwise allow the current result to be viewed without forcing
    registration.
-   Shareable result card and safe download behavior.
-   Loading, retry, validation, failure, and empty states.
-   API and environment configuration documentation.
-   Backend validation, security controls, logging, and tests.

## 2.2 Post-MVP features --- architect for, but do not fake as complete

-   User registration, login, and saved reading history.
-   Payment integration and premium entitlements.
-   Multiple portrait variations.
-   PDF report export.
-   Voice narration.
-   Multi-chapter story.
-   Additional languages.
-   Admin dashboard for managing archetypes and prompt templates.
-   Analytics and conversion reporting.

Do not build a fake payment flow or pretend a PDF/audio feature exists
if it is not implemented. Keep the architecture extensible for these
features.

------------------------------------------------------------------------

# 3. User Journey and Screens

## 3.1 Screen 1 --- Landing page

### Purpose

Explain the mystical experience and invite the user to begin.

### Required sections

1.  Navigation/header:
    -   Product logo/name placeholder.
    -   "How it works" link.
    -   "Begin your reading" primary CTA.
    -   Optional theme or language control if implemented.
2.  Hero:
    -   Strong headline, e.g. "Discover the Story Your Stars Inspire."
    -   Supporting text clarifying that the result is a symbolic,
        imaginative reading.
    -   Primary CTA: "Begin Your Reading".
    -   Premium celestial artwork or a local placeholder visual.
3.  How it works:
    -   Share your celestial profile.
    -   Explore your symbolic archetype.
    -   Reveal your story and portrait.
4.  Sample reading preview:
    -   Fictional portrait.
    -   Example archetype and short excerpt.
    -   Label the example as fictional.
5.  Trust and privacy:
    -   Photo is optional.
    -   Explain how submitted data is used.
    -   Link to privacy and terms pages.
6.  Footer:
    -   About.
    -   Privacy.
    -   Terms.
    -   Contact placeholder.
    -   Entertainment disclaimer.

### UX requirements

-   Strong visual hierarchy.
-   No cluttered dashboard-like layout.
-   Clear CTA on mobile.
-   Subtle, performant animations; respect `prefers-reduced-motion`.
-   Do not make the user believe a reading has already been calculated
    before they start.

## 3.2 Screen 2 --- Onboarding wizard

Use a multi-step wizard with progress indication, Back/Continue
controls, validation, and state preservation when moving between steps.

### Step A: Celestial identity

Fields: - Preferred name or nickname (optional). - Date of birth
(optional if user manually chooses a sign). - Zodiac sign (optional if
it can be derived under the selected sign convention). - Sign input
mode: - `derived_from_date` - `manual_symbolic_choice` -
Astrology/reading mode: default `mystical_zodiac`.

Rules: - Date of birth must be a valid date and not in the future. - Do
not require a date of birth if the user wants a manual symbolic-sign
reading. - Do not silently override a manually selected sign. - If a
date-derived sign conflicts with the selected sign, show a clear
mismatch message and ask the user to choose: 1. Use the sign derived
from the chosen convention. 2. Keep the manually selected sign as a
symbolic choice. 3. Edit the date. - Do not label a manual choice as a
verified birth-chart placement.

### Step B: Birth details (optional)

Fields: - Birth time (optional; 12-hour or 24-hour UI, normalized in
API). - Birthplace (optional; city/region/country text or supported
place selector). - Birth-time-known toggle.

Rules: - These details are not required for the default Mystical Zodiac
reading. - Do not claim to calculate ascendant, houses, Moon sign,
planetary placements, or a full natal chart unless a real calculation
module is integrated and supplied with the necessary data. - Avoid
storing unnecessary location precision. - If birthplace is entered,
validate length and sanitize text; do not geocode unless needed by a
real supported feature.

### Step C: Soul themes

Fields: - Archetype preference (optional, default "Let the stars inspire
my archetype"): - The Sage - The Guardian - The Healer - The Ruler - The
Seeker - The Artist - The Diplomat - The Wanderer - Auto-select - Main
theme (optional): - Wisdom - Courage - Healing - Leadership -
Creativity - Freedom - Love and connection - Transformation -
Discovery - Story genre (optional): - Mysterious - Adventurous -
Reflective - Royal and historical - Gentle and spiritual - Historical
setting preference: - Ancient - Medieval - Early modern - Timeless
mystical realm - Let the system choose - Reading depth: - Quick reveal -
Full reading (default) - Extended story (may be marked as a later
premium feature if not implemented) - Language (default English; list
only languages actually supported).

Rules: - Allow skipping all optional preference questions. - Use curated
enums instead of free-form prompts where possible. - If free text is
added later, sanitize and limit it, and do not let it override safety or
system rules.

### Step D: Portrait preferences

Fields: - Use a reference photo? Yes/No; default No. - If Yes: upload
photo and explicitly consent to its use for portrait generation. -
Character presentation preference (optional): - Feminine - Masculine -
Androgynous - Let the system choose - Portrait style: - Cinematic
mystical realism (default) - Antique astrology illustration - Celestial
fantasy art - Framing: - Close-up portrait - Half-body - Full-body -
Setting: - Ancient temple - Palace - Forest - Desert - Ocean - Celestial
realm - Let the system choose

Rules: - A photo is optional. - Explain that the photo is used as a
visual reference only and does not establish personality, ethnicity,
health, history, or a past-life identity. - Validate allowed MIME types
and maximum size on both client and server. - Never make uploaded photos
publicly accessible by default. - Do not send a photo to a provider
unless the user has consented and the configured provider supports the
intended use. - Provide a clear way to remove or replace the photo
before generation.

### Step E: Review and consent

Before starting generation, show a concise summary of the user's
selected details and allow edits.

Required consent: - The user understands that the output is a fictional,
astrology-inspired entertainment reading, not verified history or proof
of reincarnation. - The user consents to processing submitted
information to produce the requested reading. - If using a photo, obtain
separate explicit photo-processing consent.

Links: - Privacy notice. - Terms. - Data retention explanation.

Do not pre-check consent boxes.

## 3.3 Screen 3 --- Mystical reveal / generation

Purpose: create a calm, immersive transition while the story and
portrait are generated.

Required: - Celestial visual motif. - Progress stages based on real job
status, e.g.: 1. Preparing your symbolic profile. 2. Shaping your
fictional character. 3. Writing your story. 4. Creating your portrait. -
Cancel or leave option where technically feasible. - Retry when
generation fails. - Clear messaging when mock/demo output is being used
in development. - Do not fake progress percentages or claim the system
is calculating a real soul history. - Use asynchronous job/polling if
image generation may take a long time. - Prevent duplicate charges or
duplicate generation jobs on repeated clicks.

## 3.4 Screen 4 --- Reading results

Required sections: 1. Fictional portrait. 2. Character title, e.g. "The
Guardian of the Forgotten Kingdom". 3. Celestial signature used for the
reading. 4. Archetype and its symbolic meaning. 5. Imagined era and
setting. 6. Fictional character role/occupation. 7. Life story: -
Origins. - Daily life and role. - Defining choice or turning point. -
Important fictional relationship(s), if relevant. - Narrative
conclusion. 8. Symbolic karmic themes. 9. Present-day reflection
question. 10. Disclaimer visible without being intrusive. 11. Actions: -
Download portrait. - Share result card. - Start a new reading. - Retry a
failed portrait generation. - Delete the reading or its associated data
when storage is implemented.

### Results UX rules

-   Do not overwhelm the user with one wall of text.
-   Use cards, section headings, spacing, and a reading-friendly line
    length.
-   The portrait and text must correspond to the same character profile.
-   Do not expose internal prompts, provider names, API errors, or debug
    data.
-   Do not show a download button that does nothing.
-   Do not claim a reading has been saved permanently unless persistence
    is implemented.

## 3.5 Supporting screens

-   Privacy policy page.
-   Terms/disclaimer page.
-   Not-found page.
-   Error boundary/fallback page.
-   Optional "How it works" page.
-   Optional account/history screens only if authentication and
    persistence are implemented.

------------------------------------------------------------------------

# 4. Mystical Zodiac Interpretation Engine

## 4.1 Important product boundary

The "Mystical Zodiac" is a product-defined creative framework inspired
by common zodiac symbolism. Do not present it as a scientifically
validated system or as an established tradition if it is not one.

The system must not claim to know a user's actual past life. All
past-life names, dates, occupations, events, relationships, and deaths
are fictional narrative elements.

## 4.2 Zodiac symbolism library

Create a central, versioned data module for the 12 signs. Keep the
themes editable without changing UI components.

Suggested symbolic themes:

  Sign          Example symbolic themes
  ------------- ----------------------------------------
  Aries         Initiative, courage, action
  Taurus        Stability, patience, craftsmanship
  Gemini        Communication, curiosity, adaptability
  Cancer        Care, belonging, protection
  Leo           Leadership, expression, recognition
  Virgo         Service, precision, discernment
  Libra         Balance, relationships, fairness
  Scorpio       Transformation, intensity, mystery
  Sagittarius   Exploration, freedom, philosophy
  Capricorn     Discipline, ambition, responsibility
  Aquarius      Innovation, independence, community
  Pisces        Imagination, compassion, intuition

These are creative prompts, not factual personality assessments.

## 4.3 Archetype library

Implement a curated archetype registry. Each archetype should include: -
Stable ID. - Display name. - Short description. - Symbolic themes. -
Compatible fictional roles. - Possible setting motifs. - Visual
motifs. - Narrative outline guidance. - Exclusions or consistency
constraints.

Initial archetypes: - `sage` - `guardian` - `healer` - `ruler` -
`seeker` - `artist` - `diplomat` - `wanderer`

Example: - The Sage: learning, reflection, knowledge; possible roles
include scholar, archivist, teacher, philosopher. - The Guardian: duty,
protection, courage; possible roles include royal protector, community
defender, expedition leader.

The mapping from zodiac themes to archetypes must be deterministic or
reproducible using a seeded selection method. A user-selected archetype
takes precedence over automatic selection, but must still be treated as
a creative preference.

## 4.4 Rules for generating a reading

1.  Validate the profile and resolve zodiac/date conflicts before
    generating.
2.  Choose a zodiac-symbolism record according to the explicit input
    mode.
3.  Choose or validate an archetype.
4.  Select a compatible fictional role and setting.
5.  Create a structured character profile before writing narrative
    prose.
6.  Generate the story from the approved profile.
7.  Generate the portrait prompt from the same profile.
8.  Validate that the story and portrait prompt do not contradict the
    profile.
9.  Label the result as imaginative and symbolic.
10. Store the rule/prompt version when a reading is persisted.

### Do not:

-   Infer a real past-life identity from a face.
-   Claim to know actual historical events in the user's personal soul
    history.
-   Claim that current illness, disability, trauma, fears, relationship
    problems, or financial problems are karmic punishment.
-   Make frightening predictions, threats, or claims that the user is
    cursed.
-   Claim formal chart placements that have not been calculated.
-   State that a generated narrative is a verified memory or fact.

## 4.5 Character profile schema

Create a validated structured object similar to:

``` json
{
  "characterName": "A fictional name",
  "archetypeId": "guardian",
  "era": "ancient",
  "setting": "fictional ancient kingdom",
  "regionStyle": "historically inspired, not asserted as fact",
  "occupation": "royal protector",
  "characterTraits": ["courage", "responsibility", "loyalty"],
  "coreConflict": "balancing duty with personal freedom",
  "turningPoint": "a fictional difficult decision",
  "relationshipThemes": ["trust", "community"],
  "symbolicLessons": ["boundaries", "compassion"],
  "appearanceDescription": "fictional visual description",
  "clothingDescription": "period-inspired clothing",
  "portraitSetting": "palace courtyard at twilight",
  "visualStyle": "cinematic mystical realism",
  "fictionalDisclaimer": true
}
```

This is an example only. Generate schema-valid data; do not hard-code
this same character for every user.

## 4.6 Story output schema

Return structured JSON from the text generation service, not arbitrary
prose alone.

Suggested shape:

``` json
{
  "title": "The Guardian of the Forgotten Kingdom",
  "celestialSignature": {
    "mode": "mystical_zodiac",
    "selectedSign": "Scorpio",
    "symbolicThemes": ["transformation", "mystery", "intensity"],
    "inputMode": "manual_symbolic_choice"
  },
  "archetype": {
    "id": "guardian",
    "name": "The Guardian",
    "description": "A fictional archetype representing protection and responsibility."
  },
  "imaginedSetting": {
    "era": "ancient",
    "description": "A fictional ancient kingdom."
  },
  "characterProfile": {},
  "storySections": {
    "origins": "...",
    "dailyLife": "...",
    "turningPoint": "...",
    "relationships": "...",
    "conclusion": "..."
  },
  "symbolicKarmicThemes": [
    {
      "theme": "responsibility",
      "interpretation": "A reflective symbolic theme, not a factual claim."
    }
  ],
  "presentDayReflection": "...",
  "disclaimer": "This is an imaginative astrology-inspired reading, not a verified account of a previous life."
}
```

Validate the response with a schema validator. If the model returns
invalid JSON or omits required fields, retry safely with a bounded retry
count; otherwise return a controlled error.

------------------------------------------------------------------------

# 5. Frontend Technical Requirements

## 5.1 Stack

-   React.js.
-   Vite is recommended for frontend development/build unless the
    repository already uses a compatible setup.
-   React Router for routing.
-   Plain CSS/CSS Modules or another lightweight styling method already
    present in the repository. Choose one consistent approach.
-   Fetch or Axios for API calls; choose one and use it consistently.
-   A form validation library may be used, but validation must also
    exist on the backend.
-   Use accessible HTML semantics and keyboard-friendly controls.

Do not introduce a large UI framework without a clear reason. Keep the
visual design polished and custom.

## 5.2 Suggested frontend structure

``` text
client/
  src/
    app/
      App.jsx
      router.jsx
      providers/
    assets/
      images/
      icons/
    components/
      layout/
      navigation/
      buttons/
      cards/
      forms/
      wizard/
      loading/
      errors/
      consent/
    features/
      landing/
      onboarding/
      zodiac/
      reading/
      portrait/
      privacy/
    hooks/
    services/
      apiClient.js
      profileService.js
      readingService.js
      portraitService.js
    styles/
      tokens.css
      global.css
      utilities.css
    utils/
    main.jsx
  index.html
  package.json
  vite.config.js
```

Adjust to the repository if it already has a sensible structure.

## 5.3 Routes

Suggested routes: - `/` --- landing page. - `/how-it-works` ---
explanation of the experience. - `/reading/new` --- onboarding wizard. -
`/reading/:readingId` --- results page, only when a reading ID is valid
and accessible. - `/privacy` --- privacy notice. - `/terms` --- terms
and entertainment disclaimer. - `*` --- not-found page.

Do not expose sequential guessable IDs for private readings. Use opaque
IDs and enforce access authorization server-side.

## 5.4 Frontend state

-   Keep onboarding state in a well-defined state container or custom
    hook.
-   Do not store face photos or sensitive profile details in
    localStorage by default.
-   Do not persist data across sessions unless clearly disclosed and
    necessary.
-   Clear transient data after completion or cancellation where
    appropriate.
-   Avoid putting provider secrets or private API credentials in
    frontend environment variables.
-   Centralize API error handling.
-   Prevent multiple submissions while a request is in progress.

## 5.5 Design requirements

The UI should be: - Premium, mystical, cinematic, and elegant. -
Mobile-first and responsive. - Accessible with readable contrast and
visible focus states. - Consistent in typography, spacing, buttons,
borders, and cards. - Animated sparingly; no excessive particle effects
that hurt performance. - Designed with a central theme token file to
support future brand colors.

Do not finalize the color palette now. Use semantic CSS variables and
placeholders, such as: - `--color-bg` - `--color-surface` -
`--color-primary` - `--color-accent` - `--color-text` -
`--color-muted` - `--color-border` - `--color-success` -
`--color-warning` - `--color-danger`

Add a note in the README that final color codes will be supplied
separately and should be changed centrally.

------------------------------------------------------------------------

# 6. Backend Technical Requirements

## 6.1 Stack

-   Node.js.
-   Express.js.
-   MongoDB.
-   Mongoose.
-   Zod, Joi, or an equivalent request/schema validator.
-   A secure upload-handling strategy.
-   A structured logger.
-   Rate limiting and security middleware.

Use JavaScript or TypeScript consistently with the existing repository.
If starting from scratch, TypeScript is recommended for maintainability,
but do not mix incompatible conventions.

## 6.2 Suggested backend structure

``` text
server/
  src/
    app.js
    server.js
    config/
      env.js
      database.js
      providers.js
    routes/
      health.routes.js
      profile.routes.js
      reading.routes.js
      portrait.routes.js
    controllers/
    middleware/
      errorHandler.js
      notFound.js
      validateRequest.js
      rateLimiter.js
      requestId.js
    models/
      UserProfile.js
      Reading.js
      GenerationJob.js
    validators/
    services/
      profile.service.js
      zodiac.service.js
      interpretation.service.js
      character.service.js
      story.service.js
      portrait.service.js
      reading.service.js
      storage.service.js
      consent.service.js
    providers/
      text/
        TextProvider.js
        MockTextProvider.js
        ConfiguredTextProvider.js
      image/
        ImageProvider.js
        MockImageProvider.js
        ConfiguredImageProvider.js
    prompts/
      story.prompt.js
      portrait.prompt.js
    utils/
    tests/
  package.json
  .env.example
```

Use adapters/interfaces for providers so the product is not tightly
coupled to one AI vendor.

## 6.3 Express requirements

-   Centralized JSON error responses.
-   Request validation for all write endpoints.
-   Request IDs in logs.
-   Safe handling of malformed JSON.
-   Rate limits on generation and upload endpoints.
-   CORS configured from an environment allowlist.
-   Security headers.
-   Request body size limits.
-   Health check endpoint.
-   Graceful shutdown and database connection handling.
-   No stack traces or secret values returned to the client in
    production.

Suggested standard error response:

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please review the highlighted fields.",
    "details": []
  },
  "requestId": "opaque-request-id"
}
```

Success responses should have a consistent envelope or a clearly
documented consistent alternative.

------------------------------------------------------------------------

# 7. MongoDB Models

Implement Mongoose schemas with timestamps, indexes where appropriate,
and field validation. Keep personal data minimal.

## 7.1 UserProfile

Suggested fields: - `preferredName`: optional, length-limited string. -
`dateOfBirth`: optional date. - `selectedZodiacSign`: enum of 12
signs. - `zodiacInputMode`: enum `derived_from_date` or
`manual_symbolic_choice`. - `birthTime`: optional normalized local-time
string. - `birthplace`: optional sanitized string. - `astrologyMode`:
currently `mystical_zodiac`. - `preferredLanguage`: supported language
enum/string. - `preferences`: nested object for archetype, theme, era,
genre, reading depth, portrait style, framing, setting, and presentation
preference. - `consent`: timestamps and versioned consent records,
including separate photo consent where applicable. - `photoAssetId`:
optional reference to a private asset; avoid storing image bytes in the
profile document. - `createdAt`, `updatedAt`.

Do not store a full birth date if the user has chosen a no-date
manual-sign mode and the date is not needed.

## 7.2 Reading

Suggested fields: - `ownerId` or anonymous-session ownership token
reference, depending on auth design. - `profileId` if profile
persistence is used. - `status`: `pending`, `processing`, `completed`,
`failed`, `cancelled`. - `ruleVersion`. - `promptVersion`. -
`providerMode`: `mock` or `live` (never expose secrets). -
`celestialSignature`. - `archetypeId`. - `characterProfile`. -
`storySections`. - `symbolicKarmicThemes`. - `presentDayReflection`. -
`portraitAssetId` or private storage key. - `disclaimerShownAt`. -
`createdAt`, `updatedAt`. - `expiresAt` where retention is time-limited.

Use appropriate TTL indexes only where their behavior is suitable.
Document that TTL deletion is asynchronous and is not a substitute for
explicit deletion controls.

## 7.3 GenerationJob

Use this model only if generation is asynchronous or long-running.

Fields: - `readingId`. - `jobType`: `story`, `portrait`, `report`. -
`status`: `queued`, `processing`, `completed`, `failed`, `cancelled`. -
`attemptCount`. - `providerRequestId` if safe to store. - `errorCode`
without secrets or sensitive provider output. - `startedAt`,
`completedAt`. - `createdAt`, `updatedAt`.

Do not store raw uploaded image data or full sensitive prompts in
application logs.

## 7.4 Persistence strategy

For MVP: - Avoid requiring accounts unless necessary. - If anonymous
readings are persisted, use unguessable identifiers and secure ownership
tokens or another documented access-control design. - Do not make
reading documents publicly accessible by ID alone. - Provide a deletion
path for saved reading and photo assets. - Set and document a retention
period. - Avoid keeping uploaded photos after generation if they are no
longer needed and the user has not opted into storage.

------------------------------------------------------------------------

# 8. API Specification

Prefix all endpoints with `/api/v1`.

## 8.1 Health

### `GET /api/v1/health`

Purpose: - Verify server health. - Optionally verify database
connectivity without leaking internal details.

Example response:

``` json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

## 8.2 Zodiac validation

### `POST /api/v1/zodiac/validate`

Request:

``` json
{
  "dateOfBirth": "2005-04-26",
  "selectedZodiacSign": "Scorpio",
  "inputMode": "manual_symbolic_choice",
  "convention": "western_tropical"
}
```

Rules: - Validate sign and date. - If `derived_from_date` is requested,
derive the sign using a clearly defined convention and a tested
implementation. - If `manual_symbolic_choice` is selected, preserve the
user's symbolic choice. - Return a mismatch status and explanation when
relevant. - Never silently change user input.

Example response:

``` json
{
  "success": true,
  "data": {
    "isConsistent": false,
    "derivedSign": "Taurus",
    "selectedSign": "Scorpio",
    "inputMode": "manual_symbolic_choice",
    "message": "Your selected sign differs from the date-derived Western Sun sign. You can keep it as a symbolic choice."
  }
}
```

The example above is illustrative for the supplied date and sign. The
actual implementation must calculate the result using tested
date-boundary rules.

## 8.3 Create reading

### `POST /api/v1/readings`

Purpose: - Validate consent and profile inputs. - Resolve the zodiac
input mode. - Select archetype and themes. - Create a reading record or
generation job. - Return a job/reading identifier and current status.

Request example:

``` json
{
  "profile": {
    "preferredName": "Optional name",
    "dateOfBirth": "2005-04-26",
    "selectedZodiacSign": "Scorpio",
    "zodiacInputMode": "manual_symbolic_choice",
    "birthTime": "13:34",
    "birthplace": "Tatipaka, India",
    "astrologyMode": "mystical_zodiac",
    "preferredLanguage": "en"
  },
  "preferences": {
    "archetypeId": "auto",
    "mainTheme": "transformation",
    "storyGenre": "mysterious",
    "historicalSetting": "system_select",
    "readingDepth": "full",
    "portraitStyle": "cinematic_mystical_realism",
    "portraitFraming": "close_up",
    "portraitSetting": "system_select",
    "characterPresentation": "system_select"
  },
  "consent": {
    "readingProcessing": true,
    "fictionalReadingAcknowledged": true,
    "photoProcessing": false
  }
}
```

Requirements: - Reject invalid enums and malformed fields. - Enforce
consent before processing. - Never accept a client-supplied prompt or
provider configuration as authoritative. - Do not trust a
client-supplied `derivedSign`; calculate it server-side when
applicable. - Do not store unnecessary profile fields. - Apply rate
limits. - Support an idempotency mechanism or duplicate-submission
protection. - Return HTTP `202 Accepted` for a queued job, or
`201 Created` if the result is generated synchronously and reliably
within request limits.

## 8.4 Reading status/result

### `GET /api/v1/readings/:id`

Purpose: - Return status or result for a reading the caller is
authorized to access. - Return safe, user-facing error states. - Never
return internal prompts, secrets, provider credentials, or stack traces.

## 8.5 Retry generation

### `POST /api/v1/readings/:id/retry`

Purpose: - Retry a failed story or portrait job where allowed. - Enforce
retry limits and cost controls. - Do not generate duplicate jobs when an
active job already exists.

## 8.6 Photo upload

### `POST /api/v1/portraits/reference`

Purpose: - Upload an optional user reference photo. - Require explicit
photo consent. - Validate MIME type, extension, file signature, and file
size. - Use private storage and return an opaque asset identifier. -
Never return a public permanent storage URL by default.

Use multipart form data. Set a reasonable configurable limit, such as 5
MB for MVP, and support only the formats actually handled by the
implementation.

## 8.7 Download/share

Potential endpoints: - `GET /api/v1/readings/:id/portrait` ---
authorized portrait download or short-lived signed link. -
`POST /api/v1/readings/:id/share-card` --- generate a share card if
server-side rendering is used. - `DELETE /api/v1/readings/:id` ---
delete the reading and associated generated assets where supported. -
`DELETE /api/v1/portraits/reference/:assetId` --- delete an uploaded
reference image.

If a feature is implemented entirely client-side, document that clearly.
Every endpoint must enforce access control.

------------------------------------------------------------------------

# 9. AI Provider Integration

## 9.1 Provider architecture

**Primary live provider: OpenAI API.** Use the official OpenAI SDK and current documented API endpoints for text generation and image generation/editing. Do not invent endpoint paths or rely on undocumented parameters. Keep model names configurable through environment variables so the owner can change models without code edits. The backend must be the only component that calls OpenAI.

Implement interfaces/adapters: -
`TextProvider.generateCharacterProfile(input)` -
`TextProvider.generateStory(characterProfile, input)` -
`ImageProvider.generatePortrait(characterProfile, imagePreferences, optionalReferenceAsset)` -
Optional storage adapter for image upload, retrieval, and deletion.

Create: - A working mock provider for local development and tests. - A
live OpenAI provider adapter configured through environment variables. -
Timeouts, bounded retries, error normalization, and request logging that
excludes sensitive payloads. - Provider-specific code isolated from
controllers and UI.

Use the official OpenAI SDK and the currently documented OpenAI API for
text and image generation/editing. Do not invent provider API endpoints
or hard-code a model name into business logic. Read the model from
`OPENAI_TEXT_MODEL` and `OPENAI_IMAGE_MODEL`. Document the setup steps
and check the configured model's current capabilities before use.

### 9.1.1 OpenAI API key and configuration

- The user will provide their own OpenAI API key. Provide a backend-only
  `OPENAI_API_KEY` environment variable and explain how to create a local
  backend `.env` from `.env.example`.
- Never ask the user to paste the key into the React UI, browser console,
  chat interface, source code, Git repository, or a client-side `.env`
  variable. Never prefix it with `VITE_`, `REACT_APP_`, or any other
  frontend-exposed variable prefix.
- Add `.env` files to `.gitignore`; provide `.env.example` with blank
  placeholders only. Validate configuration at server startup and show
  a safe, actionable error if live mode is selected without a key.
- Keep the key out of API responses, logs, telemetry, exception messages,
  client bundles, and database records. Use server-side secrets management
  for deployment. Rotate the key if it is accidentally exposed.
- Configure `AI_PROVIDER_MODE=openai` for live operation and
  `AI_PROVIDER_MODE=mock` for local mock operation. Never silently switch
  production to mock mode.
- Configure model IDs via environment variables and verify them against
  the user's OpenAI API project access. Do not promise that API access or
  billing is automatically enabled; document that API billing/credits are
  separate from any ChatGPT subscription.

### 9.1.2 Reference-photo portrait generation and facial identity

When the user explicitly uploads a photo and consents to its use, pass
the image as a reference input to the supported OpenAI image generation
or editing workflow, using the official API's documented image-input
method. The generated portrait should place the same person in the
fictional historical/celestial setting. Preserve, as closely as the
model allows, the person's recognizable facial identity, face shape,
skin tone, eye shape, nose, lips, age appearance, and other defining
features. Change only requested stylistic elements such as clothing,
lighting, background, pose/framing, and atmosphere. Do not use the photo
to infer personality, zodiac sign, ethnicity, health, or actual past-life
identity.

Use a specific identity-preservation instruction in the image prompt,
for example: “Use the supplied photo as the identity reference for the
same adult person. Preserve the person's recognizable facial identity
and defining facial features. Do not beautify, age-shift, change face
shape, change skin tone, or substitute a different person. Apply the
requested historical costume, lighting, background, and cinematic
celestial styling around that identity. No text or watermark.” Adapt
this wording to the selected API's documented capabilities.

**Important limitation:** Do not claim or advertise 100% / perfect face
preservation. Generative image models may still alter facial details,
even with a reference photo. Set realistic expectations, provide a
preview before download/share, allow a limited retry/regenerate action,
and let the user discard the result. Do not repeatedly regenerate
without user action or an explicit cost/rate policy. If high-fidelity
identity is mandatory, evaluate the output with a human preview and
consider a non-generative compositing workflow rather than claiming a
guarantee the API cannot provide.

Reference photos are optional. Require explicit, informed consent before
upload and before sending the photo to OpenAI. State the purpose, provide
a cancel option, transmit only what is needed, use private storage,
minimize retention, and support deletion of both the uploaded reference
and generated output where supported. Do not include the original photo
in the report or share card by default.

## 9.2 Text-generation prompt rules

The system/developer instructions sent to the text model must require: -
Treat the reading as fictional, imaginative, and astrology-inspired. -
Never claim a factual past-life discovery. - Use only the zodiac themes
and character profile supplied by the application. - Do not invent
calculated chart placements. - Do not infer personal attributes from a
user's face. - Avoid threatening, manipulative, or frightening spiritual
claims. - Do not explain real-life trauma, disease, disability,
relationship problems, or financial hardship as karmic punishment. -
Return schema-valid JSON. - Keep character identity, era, occupation,
story, and portrait description consistent. - Use the requested language
and reading depth. - Include a clear entertainment disclaimer in the
result data.

## 9.3 Image-generation prompt rules

Build image prompts from the validated character profile. Include: -
Character role. - Fictional era and setting. - Clothing and
accessories. - Character presentation. - Composition and framing. -
Selected visual style. - Lighting and atmosphere. - Relevant
zodiac-inspired motifs, if desired. - Negative constraints against text
artifacts, watermarks, inconsistent anatomy, and contradictory attire
where supported by the provider.

The image must match the fictional character in the story.

If a reference photo is supplied: - Use it only for the disclosed,
consented visual-reference purpose. - Do not use it to infer zodiac
traits, personality, or historical identity. - Do not retain it longer
than necessary without clear consent. - Explain any provider-side data
handling that is relevant to the user's choice.

## 9.4 Mock mode

The application must run without AI credentials.

Mock mode must: - Generate deterministic, varied sample readings from
the archetype library. - Return a local placeholder portrait or a
bundled original placeholder asset. - Label mock output in development
environments so it cannot be mistaken for live AI generation by
developers/testers. - Exercise the same UI states and API contracts as
live mode. - Never claim a real provider generated mock content.

Do not rely on external image URLs that may break. Prefer local bundled
placeholder assets.

------------------------------------------------------------------------

# 10. Portrait and Report Design

## 10.1 Portrait output

Suggested default: - Portrait-oriented image. - Cinematic mystical
realism. - Rich celestial atmosphere. - Historically inspired clothing
consistent with the chosen role. - A clear focal subject and polished
composition. - No embedded text in the image; render titles and labels
in the application UI instead.

Provide controls for: - Download portrait. - Regenerate portrait
(subject to rate/cost limits). - Start a new reading.

## 10.2 Reading presentation

Create a high-quality reading page with: - Large hero portrait. -
Elegant character title. - Archetype badge or symbol. - Short
introduction. - Collapsible or well-spaced story sections. - Symbolic
themes displayed as small cards. - A reflective closing question. - A
persistent but unobtrusive disclaimer. - Share/download controls.

## 10.2.1 Designed story report as an image (required)

The final story report must be available as a polished, downloadable
image artifact—not only as plain text on the web page. Build a dedicated
report composition using HTML/CSS and the Celestial Royalty design
system. Use the generated portrait as the visual hero and render all
text with actual fonts and layout code so it remains sharp, selectable
where applicable, correctly spelled, and readable. **Do not generate the
whole report as a single AI image**, because image models may distort
letters, names, dates, paragraphs, or other report content.

Required report design: a premium cover/hero composition with character
title, archetype, portrait, and zodiac-inspired motif; well-structured
story sections with clear hierarchy; pull quotes or symbolic theme cards
where useful; a reflective closing question; and a small, readable
fictional-entertainment disclaimer. Use consistent margins, typography,
line lengths, spacing, contrast, page breaks, and image crops. Keep
private birth data and uploaded reference photos out of the export unless
the user explicitly opts in.

Provide at minimum a high-resolution PNG download. Also provide a
print-ready PDF or multi-page PDF when feasible. For long readings,
create a multi-page report with predictable pagination rather than
shrinking all text onto one very long image. If a single image export is
offered, make it a deliberate tall report/infographic with readable text.
Use a tested rendering/export method such as a browser-based DOM-to-image
solution or server-side browser rendering; ensure fonts and images finish
loading before capture. Test output dimensions, clipping, broken images,
text overflow, and page breaks. Provide a preview before download and
clear loading/error/retry states.

The report image must use the same story data as the on-screen reading;
do not paraphrase or invent a separate story during export. Use stable
report templates and sanitize/escape user- or model-generated content.

## 10.3 Share card

If implemented: - Include the portrait, character title, archetype, and
a short non-sensitive excerpt. - Do not include date of birth, birth
time, birthplace, uploaded photo, or private profile data by default. -
Let the user preview before sharing. - Use the browser's Web Share API
when supported, with a copy/download fallback. - Do not claim sharing
succeeded until the browser/API confirms it.

## 10.4 PDF export

If included in MVP or a later phase: - Use a server-side PDF solution or
a well-supported client-side method. - Keep typography readable and
images properly sized. - Include the disclaimer and generation date. -
Do not expose private asset URLs permanently. - Test pagination and
image embedding.

------------------------------------------------------------------------

# 11. Visual Design System

## 11.1 Art direction

Create a premium mystical/celestial aesthetic: - Midnight/cosmic
atmosphere. - Elegant zodiac and constellation motifs. - Refined borders
and ornamental details. - Soft glows used sparingly. - Strong contrast
and readable body text. - Spacious layouts and deliberate visual
hierarchy. - Subtle reveal animations. - Avoid cheap-looking neon
effects, excessive gradients, generic dashboard templates, and clutter.

## 11.2 Theme configuration and approved color system

Use one centralized theme file such as `src/styles/tokens.css` (or the equivalent in the chosen project structure). **The approved palette is Celestial Royalty; these are the actual brand colors to implement now, not placeholders.** Apply the same tokens consistently across the landing page, onboarding wizard, loading/reveal state, reading results, portrait view, forms, dialogs, navigation, and responsive layouts.

### Primary palette: Celestial Royalty

| Token / role | Color name | Hex | Intended use |
|---|---|---|---|
| `--color-bg` | Midnight Indigo | `#0B1026` | Main page background; the dominant canvas |
| `--color-surface` | Deep Surface | `#191F3A` | Cards, panels, wizard steps, result sections |
| `--color-surface-elevated` | Elevated Indigo | `#222945` | Popovers, elevated cards, active panels; keep distinct from the base surface |
| `--color-primary` | Antique Gold | `#D4AF65` | Primary CTA fills, important borders, icons, progress indicators |
| `--color-accent` | Mystic Violet | `#7662B8` | Selected states, magical highlights, secondary actions, restrained glow |
| `--color-text` | Starlight Ivory | `#F4EFE4` | Primary text and headings on dark backgrounds |
| `--color-text-muted` | Moonlight | `#B8BBD0` | Supporting text, descriptions, metadata on dark surfaces |
| `--color-border` | Muted Indigo Border | `#343B5A` | Subtle card outlines, separators, input borders |
| `--color-success` | Celestial Sage | `#78B89A` | Success states only |
| `--color-warning` | Solar Amber | `#E5B86A` | Warning states only |
| `--color-danger` | Rose Ember | `#E27D86` | Error/destructive states only |
| `--color-on-primary` | Deep Ink | `#171526` | Button text/icons on Antique Gold fills |

### Visual balance and application rules

- Aim for an approximate visual distribution of **50% Midnight Indigo, 20% Deep Surface, 15% Starlight Ivory, 10% Antique Gold, and 5% Mystic Violet** across the overall experience. This is a visual guideline, not a rigid per-screen quota.
- Keep the overall interface dark, cinematic, elegant, and readable. Use Antique Gold as a premium accent, not as a blanket text color. Use Mystic Violet sparingly for mystical emphasis rather than large saturated blocks.
- Primary CTA buttons should use Antique Gold (`#D4AF65`) with Deep Ink (`#171526`) text. Include hover, focus, active, disabled, and loading states.
- Use Starlight Ivory for primary text and Moonlight for secondary text on dark backgrounds. Do not use low-contrast muted text for essential instructions, form labels, errors, or key results.
- Gold is primarily for accents, borders, icons, progress, and button fills. Avoid small gold text on ivory or other light backgrounds. Do not put ivory text on gold fills if contrast is inadequate.
- Create accessible focus rings and verify contrast for every text/control pairing, targeting WCAG 2.2 AA where applicable. Do not communicate status by color alone. Add labels/icons and clear state changes.
- Use gradients only as subtle atmospheric treatments based on the approved colors. Avoid neon overload, rainbow gradients, and unrestrained glow effects.
- Keep the palette centralized so a future brand refresh can be performed by editing tokens only. Components must consume semantic tokens rather than raw hex codes.

```css
:root {
  color-scheme: dark;
  --color-bg: #0B1026;
  --color-surface: #191F3A;
  --color-surface-elevated: #222945;
  --color-primary: #D4AF65;
  --color-accent: #7662B8;
  --color-text: #F4EFE4;
  --color-text-muted: #B8BBD0;
  --color-border: #343B5A;
  --color-on-primary: #171526;
  --color-success: #78B89A;
  --color-warning: #E5B86A;
  --color-danger: #E27D86;

  --font-display: Georgia, "Times New Roman", serif;
  --font-body: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --shadow-card: 0 12px 36px rgba(0, 0, 0, 0.18);
  --content-max-width: 1200px;
}
```

If the application supports light-theme surfaces, define separate explicit semantic tokens and test their contrast. Do not simply reuse dark-theme text/surface combinations in a light theme. The default experience for this product is the dark Celestial Royalty theme.

## 11.3 Typography

-   Use a refined display face for headings and a highly readable body
    face.
-   Keep font loading performant.
-   Use a sensible fallback stack.
-   Maintain a clear type scale and comfortable line height.
-   Avoid using decorative fonts for long story paragraphs.

## 11.4 Responsive behavior

-   Mobile-first layout.
-   Wizard controls usable with one hand.
-   Results portrait adapts without cropping the subject incorrectly.
-   No horizontal overflow.
-   Touch targets should be comfortably sized.
-   Desktop layouts should use whitespace, not stretch body text across
    the entire screen.
-   Test at narrow mobile, standard mobile, tablet, laptop, and wide
    desktop sizes.

## 11.5 Accessibility

-   Semantic HTML.
-   Keyboard navigation for wizard and modal controls.
-   Visible focus states.
-   Labels and accessible error messages for all inputs.
-   Meaningful alt text for content images.
-   Decorative imagery hidden from assistive technologies when
    appropriate.
-   Sufficient contrast.
-   Respect reduced-motion settings.
-   Do not communicate status using color alone.

------------------------------------------------------------------------

# 12. Security, Privacy, and Safety

## 12.1 Data minimization

-   Do not require registration for a basic reading unless there is a
    product need.
-   Do not require a photo.
-   Do not require birth time/place for the simplified mode.
-   Do not collect government IDs, financial details, passwords, or
    unrelated sensitive information.
-   Do not use uploaded images to infer identity, ethnicity, health, or
    personality.
-   Do not use birth data for unrelated purposes without a separate
    lawful basis and disclosure.

## 12.2 Photo handling

-   Explicit consent before upload and processing.
-   Validate content type and file signature, not just filename
    extension.
-   Apply size limits and safe image decoding.
-   Store photos privately.
-   Use opaque storage identifiers and short-lived signed URLs if
    applicable.
-   Never log file contents or publicly expose upload paths.
-   Delete source photos after processing when no longer required,
    unless the user has explicitly chosen a disclosed retention feature.
-   Provide a deletion mechanism for stored images.
-   Review the selected AI provider's retention and training policies
    before sending user photos.

## 12.3 Application security

-   Store secrets in environment variables or a secrets manager.
-   Commit `.env.example`, never real `.env` secrets.
-   Validate and sanitize input.
-   Use allowlisted CORS origins.
-   Use security headers.
-   Rate-limit generation, upload, and retry endpoints.
-   Add request timeouts and payload-size limits.
-   Protect against NoSQL injection and unsafe object updates.
-   Do not blindly spread client-supplied objects into database updates.
-   Use authentication and authorization if user accounts are added.
-   Ensure anonymous reading IDs cannot be guessed or enumerated.
-   Avoid public permanent image links.
-   Use secure cookies if cookie-based authentication is implemented.
-   Keep dependencies updated and run an audit where available.
-   Avoid logging full birth dates, birthplaces, reference-photo data,
    access tokens, or provider secrets unless strictly necessary; prefer
    redacted structured logs.

## 12.4 User-facing transparency

Show a concise explanation before generation: - The story is imaginative
and astrology-inspired. - It is not verified history or proof of
reincarnation. - Birth details and optional images are used to
personalize the requested experience. - Users can choose not to upload a
photo. - Explain whether the reading is temporarily processed, saved, or
deleted.

Use a fuller privacy policy and terms page for details. Do not present
legal boilerplate as a substitute for reviewing applicable privacy
requirements in the launch market.

------------------------------------------------------------------------

# 13. Environment Variables and Configuration

Create `.env.example` files for frontend and backend as appropriate.
Include placeholders only.

Backend example:

``` env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/mystical_past_life
API_BASE_PATH=/api/v1

AI_PROVIDER_MODE=mock
# Set to openai for live generation. Keep this key on the backend only.
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=
OPENAI_IMAGE_MODEL=gpt-image-2
TEXT_PROVIDER=mock
TEXT_PROVIDER_API_KEY=
TEXT_PROVIDER_MODEL=
IMAGE_PROVIDER=mock
IMAGE_PROVIDER_API_KEY=
IMAGE_PROVIDER_MODEL=

STORAGE_PROVIDER=local
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=

MAX_UPLOAD_BYTES=5242880
READING_RETENTION_DAYS=30
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=30
```

Rules: - Use only the variables needed by the selected provider/storage
implementation. - Never use placeholder values as if they were working
credentials. - `OPENAI_API_KEY` must exist only in the backend environment;
never expose it to the React client or use frontend-prefixed variables.
- Document how to add the key to the backend `.env` locally and to the
deployment platform's server-side secret manager. - Confirm the chosen
OpenAI model is available to the user's API project; model availability
can change and should not be assumed from the default example alone. - Validate required variables at startup. - If live mode is
selected but credentials are missing, either fail with a clear
configuration error or fall back only when an explicit development
setting permits it. - Do not silently switch production to mock mode. -
Keep secrets out of frontend environment variables. - Document MongoDB
local setup and any hosted database configuration.

------------------------------------------------------------------------

# 14. Error Handling and Observability

Implement clear error categories: - `VALIDATION_ERROR` -
`CONSENT_REQUIRED` - `ZODIAC_MISMATCH_CONFIRMATION_REQUIRED` -
`RATE_LIMITED` - `UPLOAD_TOO_LARGE` - `UNSUPPORTED_FILE_TYPE` -
`PROVIDER_NOT_CONFIGURED` - `GENERATION_FAILED` - `READING_NOT_FOUND` -
`ACCESS_DENIED` - `INTERNAL_ERROR`

Requirements: - Map errors to appropriate HTTP status codes. - Return
helpful, non-sensitive user messages. - Log request ID, error code,
operation, and timing. - Redact secrets and sensitive profile/photo
content. - Set provider timeouts and bounded retries. - Do not retry
non-retryable validation failures. - Do not automatically trigger
expensive image generation repeatedly. - Show retry controls only when
retrying is safe. - Add graceful handling for network loss and abandoned
generation jobs.

------------------------------------------------------------------------

# 15. Testing Requirements

## 15.1 Frontend tests

Test: - Landing page navigation and CTA. - Wizard next/back behavior. -
Required and optional field validation. - Date/sign mismatch UX. -
Manual symbolic-sign override. - Photo consent requirement. - Photo
removal/replacement. - Loading, success, and failure states. - Result
rendering from a valid API response. - Error rendering from invalid or
failed API responses. - Responsive layout and keyboard navigation where
test tooling supports it.

## 15.2 Backend tests

Test: - Health route. - Request schema validation. - Date/sign
consistency rules and boundary dates. - Manual symbolic-sign mode. -
Consent enforcement. - Archetype selection. - Story schema validation. -
Mock provider behavior. - Provider-not-configured behavior. - Upload
MIME/type/size validation. - Rate limits. - Reading authorization and
deletion. - Duplicate submission protection. - Error response
consistency.

## 15.3 Integration tests

Test the full flow: 1. Submit valid onboarding details. 2. Resolve sign
mismatch if needed. 3. Create a reading. 4. Poll or retrieve status. 5.
Receive structured story and portrait result. 6. Render the results
page. 7. Delete the reading and associated assets where supported.

## 15.4 Build verification

Before declaring completion: - Install dependencies. - Run linting if
configured. - Run unit and integration tests. - Run frontend production
build. - Run backend tests. - Verify `.env.example` and README
instructions. - Check for exposed secrets. - Check for broken routes and
nonfunctional buttons. - Verify that mock mode works without AI
credentials.

Do not claim tests passed unless they were actually run.

------------------------------------------------------------------------

# 16. Deployment and Local Development

## 16.1 Local development

Provide root-level scripts or clear separate commands to: - Install
frontend dependencies. - Install backend dependencies. - Run the
frontend. - Run the backend. - Run both concurrently if a suitable
script is configured. - Run tests. - Build the frontend.

Suggested local services: - React development server on
`http://localhost:5173`. - Express API on `http://localhost:5000`. -
MongoDB local instance or configured hosted MongoDB URI.

Avoid assuming MongoDB is installed. Document both local and hosted
database options.

## 16.2 Production

Document: - Frontend deployment. - Backend deployment. - MongoDB Atlas
or another supported MongoDB deployment. - CORS configuration. -
Environment variables. - HTTPS. - Private object storage for production
uploads. - Logging and monitoring. - Backups and data retention. - Rate
limits and cost controls. - Provider configuration and failure behavior.

Do not deploy secrets in the frontend bundle. Do not use local
filesystem storage for user uploads in a serverless/ephemeral production
environment unless the hosting platform explicitly supports it.

------------------------------------------------------------------------

# 17. Suggested Build Milestones

## Milestone 1 --- Foundation

-   Inspect repository.
-   Scaffold frontend/backend.
-   Configure environment validation.
-   Connect MongoDB.
-   Add health route.
-   Create shared theme tokens.
-   Implement navigation and page layout.

## Milestone 2 --- Onboarding

-   Implement wizard.
-   Add client and server validation.
-   Add zodiac mismatch resolution.
-   Add optional photo upload UI and consent.
-   Add review step.

## Milestone 3 --- Interpretation engine

-   Add zodiac symbolic data.
-   Add archetype registry.
-   Add deterministic theme selection.
-   Add character profile schema.
-   Add unit tests for interpretation rules.

## Milestone 4 --- Reading generation

-   Add text provider interface.
-   Add mock provider.
-   Add structured story output validation.
-   Add reading API and status management.
-   Add results page.

## Milestone 5 --- Portrait generation

-   Add image provider interface.
-   Add mock image output.
-   Add live image provider when configured.
-   Add private storage and deletion.
-   Ensure story/portrait consistency.

## Milestone 6 --- Polish and release readiness

-   Add share/download behavior.
-   Add privacy and terms pages.
-   Add error/loading/empty states.
-   Complete responsive and accessibility checks.
-   Add tests and documentation.
-   Verify production build and security configuration.

------------------------------------------------------------------------

# 18. Acceptance Criteria

The application is not complete until all applicable criteria are met.

### Product

-   [ ] The app clearly presents itself as a mystical astrology-inspired
    entertainment experience.
-   [ ] It does not claim to prove actual past lives or reincarnation.
-   [ ] The user can complete the basic reading without uploading a
    photo.
-   [ ] Optional fields can be skipped.
-   [ ] Zodiac/date mismatches are surfaced and resolved explicitly.
-   [ ] The user can review and edit inputs before generation.
-   [ ] The story contains the required sections and reflective themes.
-   [ ] The portrait and story describe the same fictional character.
-   [ ] The disclaimer is visible in the result.
-   [ ] The result can be restarted or regenerated safely.

### Frontend

-   [ ] Responsive landing, onboarding, reveal, and results pages.
-   [ ] Functional navigation and all visible controls.
-   [ ] Accessible labels, errors, focus, and keyboard interaction.
-   [ ] Central theme tokens; no final palette hard-coded throughout
    components.
-   [ ] Loading, empty, and failure states are implemented.

### Backend

-   [ ] Express API uses `/api/v1`.
-   [ ] Requests are validated server-side.
-   [ ] MongoDB models and indexes are documented.
-   [ ] Provider adapters isolate vendor-specific code.
-   [ ] Mock mode works without AI credentials.
-   [ ] Rate limits, error handling, and security middleware are
    configured.
-   [ ] Uploaded assets are private and deletable.
-   [ ] Secrets are never returned to the client.

### Quality

-   [ ] Tests are implemented for critical business rules.
-   [ ] Build and tests are run and their actual results reported.
-   [ ] README includes setup, environment variables, run commands, and
    limitations.
-   [ ] Any unimplemented post-MVP features are explicitly listed.

------------------------------------------------------------------------

# 19. Final Instructions for Antigravity

Start by inspecting the repository and this specification. Then
implement the application end-to-end.

Prioritize a visually exceptional, coherent MVP over a large number of
shallow features. The onboarding should feel like a guided celestial
ritual, the reveal should feel cinematic, and the final reading should
feel like a premium digital artifact.

Implement the approved **Celestial Royalty** palette from Section 11.2 exactly: Midnight Indigo `#0B1026`, Deep Surface `#191F3A`, Elevated Indigo `#222945`, Antique Gold `#D4AF65`, Mystic Violet `#7662B8`, Starlight Ivory `#F4EFE4`, Moonlight `#B8BBD0`, Muted Indigo Border `#343B5A`, Deep Ink `#171526`, Celestial Sage `#78B89A`, Solar Amber `#E5B86A`, and Rose Ember `#E27D86`. Put all colors in centralized semantic CSS variables/tokens and use those tokens throughout the app. Do not use placeholders or wait for another palette. Follow the palette distribution, contrast, and component usage rules in Section 11.2.

Do not invent real astrological calculations. The initial product uses a
clearly labeled, product-defined Mystical Zodiac framework. Build the
rule engine so a formal astrology calculator could be added later
without rewriting the narrative or UI layers.

Use OpenAI as the primary live AI provider. Implement server-side OpenAI
text generation and image generation/editing using the official SDK/API.
Read `OPENAI_API_KEY` only on the backend and configure `OPENAI_TEXT_MODEL`
and `OPENAI_IMAGE_MODEL` through backend environment variables. Include
clear `.env.example` instructions, keep secrets out of Git and frontend
bundles, and make mock mode work without credentials. Document that API
billing/credits are separate from a ChatGPT subscription.

For a user-consented reference photo, use the documented OpenAI image
editing/reference-image workflow to aim for the same recognizable face
while changing the fictional era, clothing, lighting, and environment.
Do not claim perfect identity preservation; generative models can alter
facial details. Give users a preview and control over regeneration and
delete options.

The final story must also be exportable as a premium, well-designed image
report. Render all text using HTML/CSS and export a high-resolution PNG;
provide a paginated PDF as well when feasible. Do not use image generation
to draw report paragraphs or headings, because text accuracy and
readability are mandatory. Keep the image report consistent with the
actual reading and Celestial Royalty design system.

Do not fake live AI, payment, PDF, authentication, or storage
integrations. Provide functioning mock adapters for local development
and clearly documented provider configuration.

When finished, report: 1. What was implemented. 2. The project folder
structure. 3. Commands to install and run the app. 4. Required
environment variables. 5. Test and build results. 6. Features that
remain unimplemented. 7. Where to change the theme colors when the owner
provides the final palette.
