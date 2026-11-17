import React, { useCallback } from 'react';
import { useCanvasScene, seededRandom } from './useCanvasScene';

/**
 * The night the gate stands in.
 *
 * Deliberately quiet: the opening screen's focus is the gate, the traveller and
 * the two doors, all of which are drawn in the page itself. This supplies only
 * the sky behind them — a deep indigo field, a violet bloom rising where the
 * gate sits, and a slow drift of stars. Anything busier would compete with the
 * corridor animation at the centre of frame.
 */
function createPortalScene(ctx, { width, height }) {
  const random = seededRandom(0x10cada);
  const horizon = height * 0.46;

  const starCount = Math.round(Math.min(170, (width * height) / 9000));
  const stars = Array.from({ length: starCount }, () => ({
    x: random() * width,
    y: random() * horizon * 1.5,
    radius: 0.4 + random() * 1.5,
    drift: 0.01 + random() * 0.05,
    phase: random() * Math.PI * 2,
    warm: random() > 0.78,
  }));

  // The bloom thrown up by the gate.
  const bloom = ctx.createRadialGradient(
    width / 2,
    horizon,
    0,
    width / 2,
    horizon,
    Math.max(width, height) * 0.7
  );
  bloom.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
  bloom.addColorStop(0.3, 'rgba(124, 92, 240, 0.14)');
  bloom.addColorStop(0.62, 'rgba(255, 110, 199, 0.07)');
  bloom.addColorStop(1, 'rgba(10, 15, 40, 0)');

  // Cooler light pooling at the upper corners, keeping the frame from flattening.
  const corners = ctx.createLinearGradient(0, 0, width, height * 0.6);
  corners.addColorStop(0, 'rgba(111, 227, 255, 0.07)');
  corners.addColorStop(0.5, 'rgba(10, 15, 40, 0)');
  corners.addColorStop(1, 'rgba(255, 110, 199, 0.06)');

  return {
    draw(time, delta) {
      ctx.fillStyle = corners;
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        star.x += star.drift * (delta / 16);
        if (star.x > width + 4) star.x = -4;

        ctx.fillStyle = star.warm ? '#ffd9a0' : '#c6cdf0';
        ctx.globalAlpha = 0.2 + 0.45 * Math.abs(Math.sin(time / 2600 + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height);
    },
  };
}

export function PortalBackdrop() {
  const canvasRef = useCanvasScene(useCallback(createPortalScene, []));

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-backdrop)',
        pointerEvents: 'none',
        background:
          'radial-gradient(130% 95% at 50% 46%, #1b2158 0%, #0d1335 42%, #080d24 72%, #050818 100%)',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
