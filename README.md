# Time Machine

**[Open it →](https://time-machine-frontend.vercel.app)**

Two doors. One takes you back; one takes you to 2050.

**Time Machine** writes you an imaginative, astrology-inspired chronicle of a life you might have
lived, and paints a portrait of the person who lived it. **2050** does the same thing pointed the
other way: a grounded piece of speculative fiction about one life twenty-five years from now, with a
portrait to match.

Both are fiction. Neither is a prediction.

---

## Quick start

```bash
npm run install:all                     # install backend + frontend
cp "Time Machine Backend/.env.example" "Time Machine Backend/.env"
npm run dev                             # backend :5000, frontend :5173
```

Out of the box `AI_PROVIDER_MODE=mock`, so the whole product works offline with no API key and no
network: the narratives come from a local provider and the portraits are generated as SVG. Set
`AI_PROVIDER_MODE=openai` and `OPENAI_API_KEY` to switch both timelines to live generation.

MongoDB is optional in development — the server logs a warning and keeps running without it, though
readings will not persist.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Backend and frontend together |
| `npm run build` | Production frontend build |
| `npm test` | Backend (26) + frontend (40) tests |
| `npm run dev:backend` / `dev:frontend` | One side at a time |

The frontend dev server proxies `/api` to `http://localhost:5000`; override with
`VITE_API_TARGET` if the backend is on another port.

---

## How a reading is made

Both timelines run the same four-stage pipeline, and the stages are published by the API so the
reveal screen narrates what the server is actually doing rather than faking progress.

1. **Seed.** Every answer is hashed into one seed. Archetype, era or habitat, name, role, setting and
   the signal read-out are all pure functions of it, so the same answers always produce the same
   life, a retry never changes the story, and the mock and live providers agree on the facts.
2. **Skeleton.** `InterpretationService` (past) and `ForesightService` (2050) resolve *who you are*
   before any language model is asked for a sentence.
3. **Prose.** The resolved facts go to the text provider with a strict brief — imaginative fiction
   for the past, grounded speculative fiction for 2050, and in both cases explicit instructions
   never to claim anything true about the reader's real life.
4. **Portrait.** The image provider composes a portrait from the same facts. With a consented
   reference photo it attempts an identity-preserving edit first.

### Is live generation actually on?

```bash
npm --prefix "Time Machine Backend" run doctor            # check key, models, quota
npm --prefix "Time Machine Backend" run doctor -- --image # also generate one real portrait
```

Two things have to be true for real images, and both are easy to miss:
`AI_PROVIDER_MODE=openai`, **and** a working `OPENAI_API_KEY`. With either missing you still get
complete readings — but the portraits are SVG placeholders rather than generated images.

The server checks the key once at boot and prints a blunt warning if live generation is
unavailable; `GET /api/v1/health` reports the same under `provider`. When it is unavailable the app
degrades immediately instead of making each reader wait out an API timeout, and the result page
labels the portrait as a stand-in so a placeholder is never mistaken for a bad generation.

### Provider configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `AI_PROVIDER_MODE` | `mock` | `mock` or `openai` — switches both timelines together |
| `OPENAI_TEXT_MODEL` | `gpt-4o-mini` | Used for both chronicles |
| `OPENAI_IMAGE_MODEL` | `gpt-image-2` | A preference, not a requirement. The boot preflight resolves it against the models the account can actually see and substitutes the best available one, so a retired or un-enabled model never breaks a reading |
| `OPENAI_IMAGE_SIZE` | `1024x1536` | Portrait aspect, clamped per model — the `dall-e-*` family accepts a different set of sizes |

Image models differ in ways that are all hard 400s if you guess: which sizes they accept, whether
they return base64 or a URL, whether they can edit an image at all, and whether they implement
`input_fidelity` (only `gpt-image-1` ever did). `src/providers/image/imageModels.js` holds that
capability table, and requests are built from it rather than from assumptions.

---

## Architecture

```
Time Machine Backend/src
├── constants/        zodiac · archetypes · past · future (2050 canon) · stages
├── services/         interpretation (past) · foresight (2050) · prompt · reading · zodiac · storage
├── providers/        text/{Mock,OpenAI} · image/{Mock,OpenAI}
├── controllers/      reading · catalog · portrait · zodiac · health
└── models/           Reading (both timelines) · UserProfile · GenerationJob

Time Machine Frontend/src
├── theme/            TimelineProvider — sets data-timeline, re-skins everything
├── styles/           tokens (three themes) · base (type scale) · components
├── motion/           easings · Reveal · SplitText (GSAP) · interactions
├── lottie/           factory · library · LottieIcon  (animations generated in code)
├── components/       ui · layout · backdrop (canvas scenes) · reading
└── features/         portal · past · future · wizard · reveal · results · archive · continuum
```

### One document, two timelines

A `Reading` carries a `timeline` of `past` or `future`. Each half of the schema is filled by its own
timeline, and the API only serialises the half that applies — so ownership, retention, portraits,
retries and deletion are implemented exactly once. `GET /api/v1/catalog` serves every selectable
option from the same constants the validator checks against, which means the UI can never offer a
choice the API would reject.

### Three palettes, one attribute

Everything is themed from `data-timeline` on `<html>`, which re-resolves the whole token set — so
the same `<h1>` sets as a period serif on one side and an engineered geometric on the other with no
conditionals in the markup.

The opening screen has a palette of its own, taken from its artwork: an indigo night warming to
violet at the gate, with a cyan edge on the two doors. It is used on that screen and nowhere else —
step through either door and that timeline takes over completely.

|  | Past | 2050 |
| --- | --- | --- |
| Surface | Parchment, matte, no glow | Void black, lit, hard edges |
| Display | Fraunces | Unbounded |
| Text / label | Spectral / Cinzel | Space Grotesk / JetBrains Mono |
| Motion | Slow, `--dur-slow` | Fast, `--dur-fast` |
| Backdrop | Dust in a shaft of light | Horizon grid under falling data |

### Motion

Built on a small set of rules: only `transform`, `opacity`, `filter` and `clip-path` animate; every
pressable surface scales to `0.97` on `:active`; hover effects are gated behind
`(hover: hover)`; exits run faster than entrances; and nothing enters from `scale(0)`.

Declarative motion is Framer Motion; anything with a timeline — the opening scene, the warp, and
the scroll-scrubbed landing heroes (`src/motion/useScrollScene.js`) — is GSAP, so one library owns
each element end to end and two systems never write the same transform. Scrubbing is reserved for
motion tied to scroll position; reveals fire once, because content that fades back out on a few
pixels of upward scroll reads as a bug.
`prefers-reduced-motion` removes movement while keeping the opacity and colour changes that carry
meaning — the canvas backdrops draw exactly one frame, Lottie icons hold a pose, and the portal
navigates without the door animation.

The Lottie icons are generated in code (`src/lottie/`) rather than exported from After Effects, so a
single icon renders in brass on one timeline and signal-cyan on the other. `src/test/lottie.test.js`
guards the parts of the format the renderer actually requires.

---

## Features

- **The opening scene** — a painted hero (`src/assets/portal-hero.webp`) with the whole interface
  built on top of it: the wordmark, and a glass door either side of the gate. Nothing is baked into
  the artwork, so the layout stays responsive. Light passes over the hero — the core breathing, a
  highlight travelling the ring, light running down the walkway — are screen-blended CSS, and the
  hero and the cards parallax against each other on pointer move (GSAP `quickTo`).
- **The warp** (`src/motion/warp.jsx`) — choosing a door plays one continuous move across the route
  change: the card lifts, is drawn into the gate and shrinks away, the camera rushes the ring, and
  light from the core floods the frame. The navigation happens while the screen is fully blown out,
  and the destination's chunk is prefetched on hover and again on click, so the lazy route is
  already resolved before the light withdraws. Nothing flickers because nothing is ever visible
  mid-change. The overlay lives above the router so it survives the swap.
- **Two wizards** — five steps each, sharing one step machine, with per-step validation and a photo
  step that will not upload before consent is given.
- **Live reveal** — real server stages, not a fake progress bar.
- **Two reports** — a five-chapter chronicle or a 2050 dossier with signal read-out and a 2026→2050
  trajectory.
- **Archive** — every reading this browser has made, kept locally.
- **Continuum** — a past chronicle and a 2050 projection set either side of *now*, with the
  qualities both independently landed on.
- **Export** — share link, portrait download, PNG and PDF (both loaded on demand).

---

## Privacy

No account, no email, no password. A reading is reachable by its link; destructive actions
additionally require an owner token held only in the browser that created it. Photographs are opt-in
twice (consent, then upload), used solely to render that one portrait, and deleted with the reading.
Everything expires automatically after `READING_RETENTION_DAYS` (default 30).

## Tests

```bash
npm test
```

26 backend tests cover zodiac boundaries, deterministic interpretation and foresight, validation,
and both timelines end to end against a real database. 40 frontend tests render every route,
exercise both wizards including the exact payload each one posts, and validate every generated
Lottie document.
