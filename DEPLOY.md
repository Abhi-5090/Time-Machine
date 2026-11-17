# Deploying Time Machine

**Live**

| | |
| --- | --- |
| Site | https://time-machine-frontend.vercel.app |
| API  | https://time-machine-jxw0.onrender.com |


Two services: the API on **Render**, the site on **Vercel**. The database is your
existing **MongoDB Atlas** cluster.

The site proxies `/api/*` through to the API, so the browser only ever talks to one
origin. That avoids CORS entirely and means no preflight on the slow generation calls.

---

## Before you start

- A MongoDB Atlas cluster, with **Network Access → 0.0.0.0/0** allowed (Render's
  outbound IPs are not fixed on the free plan).
- A current OpenAI API key with credit.
- This repo pushed to GitHub.

---

## 1 · API on Render

**New → Web Service → connect this repo.**

| Setting | Value |
| --- | --- |
| Root Directory | `Time Machine Backend` |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/v1/health` |

> The directory name contains a space. Paste it exactly, without quotes.
>
> The API has no build step, but it defines a no-op `build` script so Render's
> default build command succeeds either way.

Environment variables:

```
NODE_ENV=production
API_BASE_PATH=/api/v1
STORAGE_PROVIDER=mongodb
AI_PROVIDER_MODE=openai
OPENAI_API_KEY=sk-...                 ← your key
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_IMAGE_MODEL=gpt-image-2
OPENAI_IMAGE_SIZE=1024x1536
MONGODB_URI=mongodb+srv://...         ← your Atlas connection string
READING_RETENTION_DAYS=30
CLIENT_ORIGIN=https://your-site.vercel.app
```

Do **not** set `PORT` — Render provides it.

Deploy, then confirm:

```bash
curl https://<your-service>.onrender.com/api/v1/health
```

`provider.live` must be `true`. If it is `false`, the `reason` says exactly what is
wrong — almost always the key.

---

## 2 · Site on Vercel

First, point the proxy at your API. In `Time Machine Frontend/vercel.json`, replace
the host in the first rewrite with your Render URL, then commit:

```json
"destination": "https://<your-service>.onrender.com/api/:path*"
```

**New Project → import this repo.**

| Setting | Value |
| --- | --- |
| Root Directory | `Time Machine Frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

No environment variables are needed — the rewrite handles the API.

<details>
<summary>Alternative: call the API directly instead of proxying</summary>

Set `VITE_API_BASE_URL=https://<your-service>.onrender.com/api/v1` on Vercel and add
your Vercel domain to `CLIENT_ORIGIN` on Render. You then depend on CORS, which is
why the rewrite is the default.
</details>

---

## 3 · Check it end to end

1. Open the site. The opening scene should load and both doors should animate.
2. Run one reading through to the end.
3. Confirm the portrait is a generated image, not a placeholder — if live generation
   is unavailable the result page says so in as many words.

---

## Things that will bite you

**The free Render instance sleeps.** After ~15 minutes idle the first request takes
30–60s to wake the service, on top of the ~40s generation. Before a demo, open the
health URL once to wake it. For an expo, the paid instance type is worth it.

**Generation takes 35–60 seconds.** That is normal for this image model. The reveal
screen polls and narrates real server stages throughout.

**Portraits are requested as WebP.** The same image as PNG is ~2.4 MB and took nine
seconds to reach a browser from the free instance — an empty frame on the screen the
whole reading builds toward. `OPENAI_IMAGE_FORMAT=png` restores lossless output if
you ever need it.

**Atlas IP allow-list.** If the API logs a connection timeout, this is why.

**Storage must be `mongodb` in production.** On `local`, portraits are written to a
filesystem that is wiped on every deploy, and saved readings break shortly after.

**Keys belong in the dashboard.** `.env` is git-ignored and must stay that way. If a
key is ever committed, rotate it rather than deleting the commit.
