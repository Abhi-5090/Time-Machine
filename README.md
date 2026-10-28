# Mystical Past-Life Astrology

An imaginative, astrology-inspired storytelling experience that weaves personalized fictional past-life chronicles, soul archetypes, and cinematic character portraits.

Users explore who they might imagine themselves to have been in another era, with the option to upload a reference photograph to preserve their recognizable facial identity in the generated portrait. Readings can be downloaded as high-resolution PNG image reports or exported as paginated PDFs.

---

## ✦ Key Features

1. **Mystical Zodiac Interpretation Engine**:
   - Deterministic Western Tropical Sun sign derivation from birth dates.
   - Intelligent sign mismatch resolution (keeps user's choice as a symbolic preference without overriding).
   - 8 Curated Soul Archetypes: *The Sage, The Guardian, The Healer, The Ruler, The Seeker, The Artist, The Diplomat, and The Wanderer*.
   - Structured character profile generator linking zodiac themes, historical eras, occupations, core conflicts, and relationships.

2. **Official OpenAI Provider Integration**:
   - Server-side integration using the official OpenAI SDK.
   - Configurable text and image model IDs via environment variables (`OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`).
   - Strict validation: API keys remain exclusively on the backend and are never sent to the client, logs, or Git.
   - Built-in, high-fidelity deterministic offline Mock Mode for local development without API credentials.

3. **Facial Identity Preservation (Highest Priority)**:
   - Optional reference photo upload with explicit, separate user consent.
   - Validates MIME types, file sizes (max 5 MB), and image magic bytes (JPEG, PNG, WebP).
   - In live mode with reference photo, passes image to OpenAI image workflow with strict identity-preservation instructions:
     > *"Use the supplied photograph as the identity reference for the same adult person. Preserve their recognizable facial identity, face shape, proportions, skin tone, eyes, nose, lips, and distinctive facial features as closely as possible..."*
   - Honest user guidance: generative AI resemblance can vary between runs; includes preview, retry, and discard options.
   - Complete privacy: original user photograph is kept private and never published or shared.

4. **High-Resolution Story Report Artifact (PNG & PDF Export)**:
   - **Mandatory Text-Rendering Rule Adherence**: The report text is rendered using HTML and CSS in the browser rather than an AI image generator, ensuring sharp, correctly spelled typography.
   - Includes hero portrait, character title, archetype badge, chronicle chapters, symbolic karmic themes, reflection prompt, and readable entertainment disclaimer.
   - One-click export to 2x DPI high-resolution PNG (`html-to-image`) and print-ready PDF (`jspdf`).

5. **Celestial Royalty Design System**:
   - Centralized semantic CSS variables based on the approved palette:
     - Midnight Indigo: `#0B1026`
     - Deep Surface: `#191F3A`
     - Elevated Indigo: `#222945`
     - Antique Gold: `#D4AF65`
     - Mystic Violet: `#7662B8`
     - Starlight Ivory: `#F4EFE4`
     - Moonlight: `#B8BBD0`
     - Muted Indigo Border: `#343B5A`
     - Deep Ink: `#171526`
     - Celestial Sage: `#78B89A`
     - Solar Amber: `#E5B86A`
     - Rose Ember: `#E27D86`

6. **Privacy & Security**:
   - Anonymous reading ownership tokens (`X-Reading-Token`).
   - Rate limiting on generation and upload endpoints.
   - Helmet security headers and CORS origin allowlists.
   - Immediate permanent deletion of readings and uploaded photographs.
   - Prominent entertainment disclaimers: never presents narratives as factual reincarnation or blames suffering on past-life karma.

---

## ✦ Project Structure

```text
Time Machine/
├── package.json                         # Root workspace orchestration
├── .gitignore                           # Git ignore rules for node_modules, .env, uploads
├── README.md                            # Complete setup and operational guide
├── Antigravity_Mystical_Astrology_Spec.md # Primary specification
│
├── Time Machine Backend/
│   ├── package.json
│   ├── .env.example                     # Safe environment template
│   ├── .gitignore
│   ├── src/
│   │   ├── server.js                    # HTTP entry point & graceful shutdown
│   │   ├── app.js                       # Express configuration & security middleware
│   │   ├── config/
│   │   │   ├── env.js                   # Environment validation & error handling
│   │   │   └── database.js              # MongoDB Mongoose connection
│   │   ├── constants/
│   │   │   ├── zodiac.js                # 12 Western Tropical signs, themes & boundaries
│   │   │   └── archetypes.js            # 8 Soul archetypes, roles & visual motifs
│   │   ├── models/
│   │   │   ├── UserProfile.js           # Minimal, privacy-first profile schema
│   │   │   ├── Reading.js               # Full reading state, chronicle & portrait links
│   │   │   └── GenerationJob.js         # Multi-stage asynchronous job tracker
│   │   ├── routes/
│   │   │   ├── health.routes.js         # Health check and DB status
│   │   │   ├── zodiac.routes.js         # Sign calculation & mismatch validation
│   │   │   ├── reading.routes.js        # Create, poll, retry, delete reading
│   │   │   └── portrait.routes.js       # Reference upload & authorized portrait serving
│   │   ├── controllers/                 # Route handlers
│   │   ├── middleware/
│   │   │   ├── auth.js                  # Anonymous reading ownership verification
│   │   │   ├── errorHandler.js          # Centralized error mapping & secret redaction
│   │   │   ├── rateLimiter.js           # Rate limiting for generation & uploads
│   │   │   ├── requestId.js             # UUID request tracking
│   │   │   └── validate.js              # Joi schema validation
│   │   ├── services/
│   │   │   ├── zodiac.service.js        # Boundary date calculation & mismatch logic
│   │   │   ├── interpretation.service.js# Deterministic archetype & character builder
│   │   │   ├── reading.service.js       # Reading lifecycle orchestration
│   │   │   ├── storage.service.js       # Private local file storage with magic bytes
│   │   │   └── prompt.service.js        # Facial preservation & story prompts
│   │   └── providers/
│   │       ├── text/
│   │       │   ├── TextProvider.js      # Base text interface
│   │       │   ├── OpenAITextProvider.js# Live GPT-4o-mini structured JSON generation
│   │       │   └── MockTextProvider.js  # Rich offline deterministic story generator
│   │       └── image/
│   │           ├── ImageProvider.js     # Base image interface
│   │           ├── OpenAIImageProvider.js# Live DALL-E-3 / image edit with identity prompt
│   │           └── MockImageProvider.js # Procedural celestial SVG portrait generator
│   └── tests/
│       ├── zodiac.test.js               # Unit tests for zodiac dates & mismatches
│       ├── interpretation.test.js       # Unit tests for character profiling
│       ├── api.test.js                  # Integration tests for routes & middleware
│       └── integration.test.js          # End-to-end reading creation & deletion test
│
└── Time Machine Frontend/
    ├── package.json
    ├── vite.config.js                   # Vite config with API proxy
    ├── index.html                       # HTML shell with Google Fonts
    └── src/
        ├── main.jsx                     # React entry point
        ├── App.jsx                      # App shell with Navbar & Footer
        ├── router.jsx                   # React Router route definitions
        ├── styles/
        │   ├── tokens.css               # Exact Celestial Royalty palette & tokens
        │   ├── global.css               # Typography, focus states, resets
        │   └── utilities.css            # Buttons, cards, badges, grids
        ├── components/
        │   ├── common/Navbar.jsx        # Navigation header with live/mock status badge
        │   ├── common/Footer.jsx        # Footer with entertainment disclaimer & links
        │   └── report/StoryReport.jsx   # High-resolution PNG & PDF report exporter
        ├── features/
        │   ├── landing/LandingPage.jsx  # Hero, How It Works, Sample Preview, Privacy Trust
        │   ├── onboarding/OnboardingWizard.jsx # 5-step wizard with real-time mismatch handling
        │   ├── reveal/RevealScreen.jsx  # Multi-stage live job polling & astrolabe spinner
        │   ├── results/ResultsPage.jsx  # Results page with portrait, chapters, themes, reflection
        │   └── static/                  # How It Works, Privacy Policy, Terms, 404
        ├── services/api.js              # Centralized API client with token storage
        └── test/
            ├── setup.js
            ├── Onboarding.test.jsx
            └── StoryReport.test.jsx
```

---

## ✦ Installation and Run Commands

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas connection string.

### 1. Install All Dependencies
From the repository root:
```bash
npm run install:all
```

### 2. Configure Backend Environment
Navigate to `Time Machine Backend` and copy the example environment file:
```bash
cd "Time Machine Backend"
cp .env.example .env
```
*(By default, `AI_PROVIDER_MODE=mock` is enabled, allowing the application to run offline without an OpenAI key).*

### 3. Run Development Servers
From the repository root, run both backend and frontend concurrently:
```bash
npm run dev
```

Alternatively, run each service in separate terminal windows:
- **Backend**:
  ```bash
  cd "Time Machine Backend"
  npm run dev
  ```
  *(Starts Express server on `http://localhost:5000`)*

- **Frontend**:
  ```bash
  cd "Time Machine Frontend"
  npm run dev
  ```
  *(Starts Vite dev server on `http://localhost:5173`)*

---

## ✦ Secure OpenAI API Configuration

To enable live OpenAI generation:

1. Open `Time Machine Backend/.env`.
2. Configure these variables:
   ```env
   AI_PROVIDER_MODE=openai
   OPENAI_API_KEY=sk-proj-your-actual-openai-api-key-here
   OPENAI_TEXT_MODEL=gpt-4o-mini
   OPENAI_IMAGE_MODEL=dall-e-3
   ```
3. Restart the backend server. The health route (`/api/v1/health`) and the frontend navigation bar will display `✦ Live AI`.

### Important Notes on OpenAI Access & Billing
- **API Credits vs. ChatGPT Plus**: OpenAI API usage is billed pay-as-you-go and is **completely separate** from a ChatGPT Plus web subscription. You must have an active billing method or prepaid credits on your OpenAI Platform account.
- **Model Availability**: Ensure your OpenAI organization has access to the configured models.
- **Security Safeguards**: The `OPENAI_API_KEY` is validated on startup and is kept strictly server-side. It is never transmitted to the browser or included in git commits.

---

## ✦ Tests and Build Results

### Run All Tests
```bash
npm test
```
- **Backend Tests**: 16 passed (Zodiac boundary dates, mismatch validation, character profiling, API validation, Multer magic-byte detection, end-to-end reading lifecycle with authorized deletion).
- **Frontend Tests**: 4 passed (Onboarding wizard navigation, zodiac selection, multi-step review, StoryReport rendering).

### Production Build
```bash
npm run build
```
Builds the frontend production bundle via Vite with zero warnings or errors.

---

## ✦ Where to Modify Theme Design Tokens

All colors, typography, radii, and shadows are centralized in a single file:
```text
Time Machine Frontend/src/styles/tokens.css
```
To adjust colors or rebrand in the future, simply update the CSS custom properties in `:root`. Components throughout the application consume these semantic tokens rather than hardcoded hex values.

---

## ✦ Entertainment & Ethical Disclaimer

Mystical Past-Life Astrology is designed purely as an imaginative entertainment experience for personal storytelling and artistic reflection. It does not claim to prove reincarnation, diagnose health conditions, or provide verified historical facts.
