import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Canvas lifecycle shared by every backdrop.
 *
 * Handles device-pixel-ratio scaling, resize, visibility and reduced motion so
 * the individual scenes only have to describe what a frame looks like.
 *
 * `createScene(ctx, size)` returns `{ draw(time, delta), resize(size) }`.
 * It is re-created on resize so scenes can lay out against real dimensions.
 *
 * Two behaviours worth knowing about:
 *   · the loop stops entirely when the tab is hidden, so a backdrop never burns
 *     battery behind another window;
 *   · under `prefers-reduced-motion` exactly one frame is drawn — the texture
 *     survives, the movement does not.
 */
export function useCanvasScene(createScene, { maxDpr = 2 } = {}) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let scene = null;
    let frame = 0;
    let lastTime = 0;
    let running = true;
    let size = { width: 0, height: 0, dpr: 1 };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return false;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = { width, height, dpr };
      return true;
    };

    const build = () => {
      if (!measure()) return;
      scene = createScene(ctx, size);
      if (reduceMotion) {
        ctx.clearRect(0, 0, size.width, size.height);
        scene.draw(0, 0);
      }
    };

    const loop = (time) => {
      if (!running || !scene) return;
      const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      ctx.clearRect(0, 0, size.width, size.height);
      scene.draw(time, delta);
      frame = requestAnimationFrame(loop);
    };

    build();

    if (!reduceMotion) {
      frame = requestAnimationFrame(loop);
    }

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 140);
    };

    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        lastTime = 0;
        frame = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [createScene, reduceMotion, maxDpr]);

  return canvasRef;
}

/** Deterministic pseudo-random so a backdrop looks the same across reloads. */
export function seededRandom(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 100000) / 100000;
  };
}
