import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

/**
 * `npm run doctor` — checks that live generation will actually work.
 *
 * Pass --image to spend a real credit and produce one portrait end to end,
 * written to ./uploads/portraits so it can be opened and judged.
 */

const wantImage = process.argv.includes('--image');
const key = (process.env.OPENAI_API_KEY || '').trim();
const textModel = process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini';
const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const size = process.env.OPENAI_IMAGE_SIZE || '1024x1536';

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const info = (m) => console.log(`    ${m}`);

console.log('\nTime Machine — provider check\n');

console.log(`mode: ${process.env.AI_PROVIDER_MODE || 'mock'}`);
if ((process.env.AI_PROVIDER_MODE || 'mock') !== 'openai') {
  bad('AI_PROVIDER_MODE is not "openai" — readings will use the offline generator and portraits will be placeholders.');
  info('Set AI_PROVIDER_MODE=openai in Time Machine Backend/.env');
}

if (!key) {
  bad('OPENAI_API_KEY is empty.');
  process.exit(1);
}
ok(`OPENAI_API_KEY present (${key.length} chars, ${key.slice(0, 7)}…${key.slice(-4)})`);

const client = new OpenAI({ apiKey: key, maxRetries: 1, timeout: 60000 });

let available = new Set();
try {
  const page = await client.models.list();
  available = new Set(page.data.map((m) => m.id));
  ok('key accepted by OpenAI');
} catch (error) {
  bad(`key rejected — ${error?.code || error?.error?.code || error?.status}: ${error?.message}`);
  if ((error?.code || error?.error?.code) === 'expired_secret_key') {
    info('Create a new key at https://platform.openai.com/api-keys and paste it into .env, then rerun.');
  }
  process.exit(1);
}

console.log(`\ntext model: ${textModel}`);
available.has(textModel) ? ok('listed for this account') : bad('not listed for this account');
try {
  const r = await client.chat.completions.create({
    model: textModel,
    messages: [{ role: 'user', content: 'Reply with one word: ready' }],
    max_tokens: 5,
  });
  ok(`generation works (${r.choices[0].message.content.trim()})`);
} catch (error) {
  bad(`generation failed — ${error?.message}`);
}

const { resolveImageModel } = await import('../src/providers/image/imageModels.js');
const resolved = resolveImageModel({ configured: imageModel, available });

console.log(`\nimage model: ${imageModel} @ ${size}`);
if (available.has(imageModel)) {
  ok('listed for this account');
} else if (!resolved.unavailable) {
  bad(`"${imageModel}" is not available to this account`);
  ok(`will use "${resolved.model}" instead`);
  info(`Set OPENAI_IMAGE_MODEL=${resolved.model} in .env to make that explicit.`);
} else {
  bad('no usable image model on this account');
}
info(`image models visible here: ${[...available].filter((m) => /^(gpt-image|dall-e|chatgpt-image)/.test(m)).join(', ') || 'none'}`);

if (!wantImage) {
  console.log('\n  Run `npm run doctor -- --image` to generate one real portrait and confirm end to end.');
  console.log('  (That spends a small amount of credit.)\n');
  process.exit(0);
}

try {
  console.log('  generating one portrait…');
  const started = Date.now();
  const payload = await client.images.generate({
    model: resolved.model,
    prompt:
      'A cinematic close-up portrait of a fictional astronomer-monk in an ancient mountain observatory, ' +
      'candlelight, deep indigo and antique gold, oil-on-canvas texture. No text, no watermark.',
    n: 1,
    size,
  });

  const first = payload.data[0];
  const buffer = first.b64_json
    ? Buffer.from(first.b64_json, 'base64')
    : Buffer.from(await (await fetch(first.url)).arrayBuffer());

  const dir = path.resolve('uploads/portraits');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `doctor-${Date.now()}.png`);
  fs.writeFileSync(file, buffer);

  ok(`portrait generated in ${((Date.now() - started) / 1000).toFixed(1)}s — ${(buffer.length / 1024).toFixed(0)}KB`);
  info(file);
  console.log('\n  Live image generation is working.\n');
} catch (error) {
  bad(`image generation failed — ${error?.status} ${error?.code || error?.error?.code || ''}: ${error?.message}`);
  process.exit(1);
}
