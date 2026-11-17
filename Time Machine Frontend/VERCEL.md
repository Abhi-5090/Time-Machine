# vercel.json

Vercel's schema rejects unknown keys, so the config carries no comments. What the
two rewrites do:

**`/api/:path*` → the Render service.** The browser only ever talks to this origin,
so every request is first-party: no CORS, and no preflight on the slow generation
calls. Change the host here if the API moves.

**Everything else → `/index.html`.** Client-side routing: a reader who opens
`/reading/<id>` directly, or refreshes mid-reading, gets the app shell rather than a
404. `assets/` is excluded so hashed build output is still served as files.

The `headers` block caches those hashed assets for a year — safe, because a content
change produces a new filename.
