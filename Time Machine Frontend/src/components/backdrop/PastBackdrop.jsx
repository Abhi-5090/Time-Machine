import React, { useCallback } from 'react';
import { useCanvasScene, seededRandom } from './useCanvasScene';

/**
 * The past's backdrop: dust in a shaft of afternoon light.
 *
 * Deliberately almost nothing. The past timeline is meant to feel like printed
 * matter in a quiet room, so the only movement is motes drifting at a speed
 * that is easy to miss — which is the point. Anything more assertive would
 * fight the typography, which is what the reader is actually here for.
 */
function createPastScene(ctx, { width, height }) {
  const random = seededRandom(0x7a5d19);
  const count = Math.round(Math.min(90, (width * height) / 16000));

  const motes = Array.from({ length: count }, () => ({
    x: random() * width,
    y: random() * height,
    radius: 0.6 + random() * 1.9,
    drift: 0.06 + random() * 0.16,
    sway: 0.3 + random() * 0.9,
    phase: random() * Math.PI * 2,
    alpha: 0.1 + random() * 0.26,
  }));

  // A single warm shaft, angled like light through a tall window.
  const shaft = ctx.createLinearGradient(width * 0.72, 0, width * 0.26, height);
  shaft.addColorStop(0, 'rgba(255, 238, 198, 0.5)');
  shaft.addColorStop(0.45, 'rgba(226, 198, 148, 0.16)');
  shaft.addColorStop(1, 'rgba(188, 160, 110, 0)');

  const vignette = ctx.createRadialGradient(
    width / 2,
    height * 0.42,
    Math.min(width, height) * 0.22,
    width / 2,
    height * 0.5,
    Math.max(width, height) * 0.82
  );
  vignette.addColorStop(0, 'rgba(120, 94, 54, 0)');
  vignette.addColorStop(1, 'rgba(96, 74, 40, 0.3)');

  return {
    draw(time, delta) {
      ctx.fillStyle = shaft;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(92, 70, 38, 1)';
      for (const mote of motes) {
        mote.y -= mote.drift * (delta / 16);
        if (mote.y < -6) {
          mote.y = height + 6;
          mote.x = random() * width;
        }

        const x = mote.x + Math.sin(time / 2600 + mote.phase) * mote.sway * 6;
        ctx.globalAlpha = mote.alpha * (0.6 + 0.4 * Math.sin(time / 1800 + mote.phase));
        ctx.beginPath();
        ctx.arc(x, mote.y, mote.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    },
  };
}

export function PastBackdrop() {
  const canvasRef = useCanvasScene(useCallback(createPastScene, []));

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-backdrop)',
        pointerEvents: 'none',
        background: 'var(--bg)',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      {/* Paper fibre. CSS rather than canvas: it never changes, so it should
          not cost a repaint every frame. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          mixBlendMode: 'multiply',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(120, 94, 54, 0.09) 1px, transparent 0), radial-gradient(circle at 7px 9px, rgba(120, 94, 54, 0.05) 1px, transparent 0)',
          backgroundSize: '12px 12px, 23px 19px',
        }}
      />
    </div>
  );
}
