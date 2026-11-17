import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';

/**
 * The warp: travelling through the gate from one timeline into the next.
 *
 * A route change normally shows its seams — the old page unmounts, a lazy chunk
 * resolves, the new page paints. This drives the whole thing as one continuous
 * move instead, in two halves either side of the navigation:
 *
 *   close   the caller's own elements fly into the gate, the gate rushes the
 *           camera, and light from its core floods the frame
 *   ── navigate, while the screen is fully blown out ──
 *   open    the light withdraws into the gate behind you and the new page
 *           resolves out of it
 *
 * Two things keep it seamless. The overlay lives above the router, so it
 * survives the route change and covers the swap completely; and the
 * destination's code is prefetched during the close, so the lazy chunk is
 * already resolved before the screen is uncovered. Nothing flickers because
 * nothing is ever visible mid-change.
 */

const WarpContext = createContext({ isWarping: false, runWarp: null });

/** Where the gate sits in the hero: centred, a little above the midline. */
export const GATE_ANCHOR = { x: 0.5, y: 0.46 };

export function WarpProvider({ children }) {
  const overlayRef = useRef(null);
  const coreRef = useRef(null);
  const streaksRef = useRef(null);

  // Set while the close half has finished and the open half is waiting for the
  // destination route to mount.
  const pendingRef = useRef(null);
  const [isWarping, setIsWarping] = useState(false);

  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const runWarp = useCallback(
    ({ tone = 'past', origin, build, preload, onNavigate }) => {
      // Reduced motion gets the destination, not the journey.
      if (reduceMotion || !overlayRef.current) {
        onNavigate();
        return;
      }

      const overlay = overlayRef.current;
      const core = coreRef.current;
      const streaks = streaksRef.current;

      setIsWarping(true);
      overlay.dataset.tone = tone;
      overlay.style.setProperty('--warp-x', `${origin.x}px`);
      overlay.style.setProperty('--warp-y', `${origin.y}px`);

      // Start fetching the destination now. It almost always resolves long
      // before the close finishes, but the navigation waits on it regardless so
      // a cold cache can never strand the reader on a white screen.
      const prefetch = preload ? Promise.resolve(preload()).catch(() => {}) : Promise.resolve();

      gsap.set(overlay, { opacity: 0, display: 'block' });
      gsap.set(core, { scale: 0.18, opacity: 0 });
      gsap.set(streaks, { opacity: 0, scale: 0.4 });

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete: () => {
          pendingRef.current = { tone };
          prefetch.then(onNavigate);
        },
      });

      // The caller contributes the page-specific half: its cards flying into
      // the gate, its chrome leaving, its hero rushing the camera.
      build?.(timeline);

      /*
       * The light enters late on purpose. The caller's half — a card being
       * drawn into the gate — is the part that explains what is happening, so
       * the flood only starts once that has played and is there to cover the
       * navigation, not to replace the move.
       */
      timeline
        .to(overlay, { opacity: 1, duration: 0.46, ease: 'power2.in' }, 0.55)
        .to(core, { opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.55)
        .to(core, { scale: 30, duration: 0.58, ease: 'power3.in' }, 0.62)
        .to(streaks, { opacity: 0.9, scale: 2.8, duration: 0.6, ease: 'power3.in' }, 0.55);
    },
    [reduceMotion]
  );

  // The open half, once the destination has mounted and painted.
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending || !overlayRef.current) return undefined;
    pendingRef.current = null;

    const overlay = overlayRef.current;
    const core = coreRef.current;
    const streaks = streaksRef.current;

    let frame = 0;
    let timeline;

    // Two frames: one for React to commit the new route, one for the browser to
    // paint it. Starting the reveal before that paint is what causes a flash.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const main = document.getElementById('main');

        timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            gsap.set(overlay, { display: 'none' });
            if (main) gsap.set(main, { clearProps: 'transform,opacity,filter' });
            setIsWarping(false);
          },
        });

        timeline
          .to(core, { scale: 1.2, duration: 1, ease: 'power3.out' }, 0)
          .to(streaks, { opacity: 0, scale: 0.6, duration: 0.6, ease: 'power2.out' }, 0)
          .to(overlay, { opacity: 0, duration: 0.72, ease: 'power2.inOut' }, 0.18);

        if (main) {
          timeline.fromTo(
            main,
            { opacity: 0, scale: 1.07, transformOrigin: '50% 42%' },
            { opacity: 1, scale: 1, duration: 0.92, ease: 'power3.out' },
            0.05
          );
        }
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      timeline?.kill();
    };
  }, [location.pathname]);

  return (
    <WarpContext.Provider value={{ isWarping, runWarp }}>
      {children}

      <div className="warp" ref={overlayRef} aria-hidden="true">
        <span className="warp-streaks" ref={streaksRef} />
        <span className="warp-core" ref={coreRef} />
      </div>
    </WarpContext.Provider>
  );
}

export function useWarp() {
  return useContext(WarpContext);
}
