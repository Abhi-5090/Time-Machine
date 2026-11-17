import React, { useCallback } from 'react';
import { useCanvasScene, seededRandom } from './useCanvasScene';

/**
 * 2050's backdrop: a horizon grid under falling data.
 *
 * Three layers, drawn back to front — a receding perspective grid, a field of
 * vertical traces, and a slow horizon bloom. Everything is additive-light on a
 * near-black field, which is what gives 2050 its glow without a single blur
 * filter (blur is expensive, and at full-viewport size it is the first thing
 * that drops frames).
 */
function createFutureScene(ctx, { width, height }) {
  const random = seededRandom(0x2050a7);
  const horizon = height * 0.58;

  const traceCount = Math.round(Math.min(70, width / 18));
  const traces = Array.from({ length: traceCount }, () => ({
    x: Math.round(random() * width),
    y: random() * height,
    length: 40 + random() * 160,
    speed: 0.25 + random() * 1.5,
    alpha: 0.08 + random() * 0.3,
    hot: random() > 0.86,
  }));

  const starCount = Math.round(Math.min(120, (width * height) / 14000));
  const stars = Array.from({ length: starCount }, () => ({
    x: random() * width,
    y: random() * horizon,
    radius: random() * 1.1,
    phase: random() * Math.PI * 2,
  }));

  const bloom = ctx.createRadialGradient(
    width / 2,
    horizon,
    0,
    width / 2,
    horizon,
    Math.max(width, height) * 0.62
  );
  bloom.addColorStop(0, 'rgba(94, 242, 255, 0.16)');
  bloom.addColorStop(0.35, 'rgba(124, 58, 237, 0.09)');
  bloom.addColorStop(1, 'rgba(4, 7, 14, 0)');

  const gridFade = ctx.createLinearGradient(0, horizon, 0, height);
  gridFade.addColorStop(0, 'rgba(94, 242, 255, 0.28)');
  gridFade.addColorStop(1, 'rgba(94, 242, 255, 0)');

  return {
    draw(time, delta) {
      // ── Horizon bloom ─────────────────────────────────────────────────
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height);

      // ── Stars above the horizon ───────────────────────────────────────
      ctx.fillStyle = '#9FD8EA';
      for (const star of stars) {
        ctx.globalAlpha = 0.22 + 0.3 * Math.abs(Math.sin(time / 2400 + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Perspective grid below the horizon ────────────────────────────
      ctx.strokeStyle = gridFade;
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Verticals converge on a vanishing point at the centre of the horizon.
      const vanishX = width / 2;
      for (let i = -14; i <= 14; i++) {
        const spread = i * (width / 10);
        ctx.moveTo(vanishX + spread * 0.06, horizon);
        ctx.lineTo(vanishX + spread, height);
      }

      // Horizontals scroll toward the viewer, spaced so they bunch at distance.
      const scroll = (time / 2600) % 1;
      for (let i = 0; i < 16; i++) {
        const t = (i + scroll) / 16;
        const y = horizon + (height - horizon) * (t * t);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // ── Falling traces ────────────────────────────────────────────────
      for (const trace of traces) {
        trace.y += trace.speed * (delta / 16);
        if (trace.y - trace.length > height) {
          trace.y = -trace.length;
          trace.x = Math.round(random() * width);
        }

        const gradient = ctx.createLinearGradient(0, trace.y - trace.length, 0, trace.y);
        const colour = trace.hot ? '255, 46, 154' : '94, 242, 255';
        gradient.addColorStop(0, `rgba(${colour}, 0)`);
        gradient.addColorStop(1, `rgba(${colour}, ${trace.alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = trace.hot ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(trace.x, trace.y - trace.length);
        ctx.lineTo(trace.x, trace.y);
        ctx.stroke();
      }

      // ── Horizon line ──────────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(94, 242, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(width, horizon);
      ctx.stroke();
    },
  };
}

export function FutureBackdrop() {
  const canvasRef = useCanvasScene(useCallback(createFutureScene, []));

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-backdrop)',
        pointerEvents: 'none',
        background:
          'radial-gradient(120% 80% at 50% 58%, #071225 0%, #04070E 55%, #01030A 100%)',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      {/* CRT scanlines, held in CSS so they cost nothing per frame. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(94, 242, 255, 0.045) 0px, rgba(94, 242, 255, 0.045) 1px, transparent 1px, transparent 4px)',
        }}
      />
    </div>
  );
}
