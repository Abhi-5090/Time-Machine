import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { PageShell } from '../../components/layout/PageShell';
import { Icon } from '../../components/ui/Icon';
import { LottieIcon } from '../../lottie/LottieIcon';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { useWarp, GATE_ANCHOR } from '../../motion/warp';
import { preloadRoute } from '../../router';
import heroUrl from '../../assets/portal-hero.webp';
import heroSmallUrl from '../../assets/portal-hero-sm.webp';
import './portal.css';

/**
 * The opening screen.
 *
 * A painted hero with the whole interface built on top of it. Nothing is baked
 * into the artwork, so the layout is free to be responsive.
 *
 * All of the motion here is GSAP rather than the declarative layer used
 * elsewhere, for one reason: the departure has to hand off mid-flight to the
 * warp timeline that spans the route change. One library owning these elements
 * end to end means no two systems ever write the same transform.
 */

const DOORS = [
  {
    id: 'past',
    side: 'left',
    title: 'Time Machine',
    caption: 'Step into your past. Know who you were.',
    marker: 'Behind you',
    lottie: 'hourglass',
    to: '/past',
    cta: 'Open the chamber',
  },
  {
    id: 'future',
    side: 'right',
    title: '2050',
    caption: 'Do you want to know about your future?',
    marker: 'Ahead of you',
    lottie: 'rocket',
    to: '/future',
    cta: 'Run the projection',
  },
];

export function PortalPage() {
  const navigate = useNavigate();
  const { runWarp } = useWarp();
  const reduceMotion = useReducedMotion();
  const isNarrow = useMediaQuery('(max-width: 900px)');

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const heroRef = useRef(null);
  const uiRef = useRef(null);
  const doorRefs = useRef({});
  const [departing, setDeparting] = useState(null);

  /* ── Entrance, and pointer parallax ──────────────────────────────────── */
  useLayoutEffect(() => {
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .fromTo(
          '.hero-image',
          { opacity: 0, scale: 1.12 },
          { opacity: 1, scale: 1, duration: 1.8 },
          0
        )
        .fromTo('.portal-masthead', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35)
        .fromTo(
          '.door',
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.14 },
          0.6
        )
        .fromTo('.portal-foot', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.1);

      /*
       * Parallax. `quickTo` keeps a single tween alive per axis and retargets
       * it, so the plate and the interface glide toward the pointer instead of
       * snapping to it — and nothing new is allocated on each pointer move.
       */
      const hero = heroRef.current;
      const ui = uiRef.current;
      if (!hero || !ui || isNarrow) return;

      const heroX = gsap.quickTo(hero, 'x', { duration: 0.9, ease: 'power3' });
      const heroY = gsap.quickTo(hero, 'y', { duration: 0.9, ease: 'power3' });
      const uiX = gsap.quickTo(ui, 'x', { duration: 0.7, ease: 'power3' });
      const uiY = gsap.quickTo(ui, 'y', { duration: 0.7, ease: 'power3' });

      const onMove = (event) => {
        const bounds = stageRef.current?.getBoundingClientRect();
        if (!bounds) return;
        const x = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
        const y = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
        heroX(x * -16);
        heroY(y * -10);
        uiX(x * 16);
        uiY(y * 10);
      };

      const onLeave = () => {
        heroX(0);
        heroY(0);
        uiX(0);
        uiY(0);
      };

      const stage = stageRef.current;
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerleave', onLeave);
      return () => {
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerleave', onLeave);
      };
    }, rootRef);

    return () => context.revert();
  }, [reduceMotion, isNarrow]);

  /* ── Departure: the chosen door flies into the gate ──────────────────── */
  const choose = useCallback(
    (door) => {
      if (departing) return;
      setDeparting(door.id);

      if (reduceMotion) {
        navigate(door.to);
        return;
      }

      const stage = stageRef.current;
      const chosen = doorRefs.current[door.id];
      const other = doorRefs.current[door.id === 'past' ? 'future' : 'past'];
      const bounds = stage.getBoundingClientRect();

      // The gate's centre, in viewport coordinates.
      const gate = {
        x: bounds.left + bounds.width * GATE_ANCHOR.x,
        y: bounds.top + bounds.height * GATE_ANCHOR.y,
      };

      runWarp({
        tone: door.id,
        origin: gate,
        preload: preloadRoute[door.id],
        onNavigate: () => navigate(door.to),
        build: (timeline) => {
          // Everything that is not the chosen door gets out of the way first.
          timeline
            .to('.portal-masthead, .portal-foot', { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0)
            .to(
              other,
              { opacity: 0, scale: 0.92, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' },
              0
            );

          if (chosen) {
            const card = chosen.getBoundingClientRect();
            const dx = gate.x - (card.left + card.width / 2);
            const dy = gate.y - (card.top + card.height / 2);
            const bloom = chosen.querySelector('.door-card-bloom');

            timeline
              // A beat of lift before the fall, so the card reads as being
              // taken by the gate rather than simply shrinking away.
              .to(chosen, { y: -18, scale: 1.04, duration: 0.24, ease: 'power2.out' }, 0)
              .to(
                chosen,
                {
                  x: dx,
                  y: dy,
                  scale: 0.06,
                  rotation: door.side === 'left' ? -12 : 12,
                  duration: 0.68,
                  ease: 'power2.in',
                },
                0.18
              )
              // Opacity is its own tween, held at full for most of the flight:
              // a card that fades as it travels is a card nobody sees arrive.
              .to(chosen, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.56);

            if (bloom) {
              timeline.to(bloom, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.18);
            }
          }

          // Only then does the camera rush the gate.
          timeline.to(
            '.hero-image',
            {
              scale: 7.2,
              duration: 0.85,
              ease: 'power2.in',
              transformOrigin: `${GATE_ANCHOR.x * 100}% ${GATE_ANCHOR.y * 100}%`,
            },
            0.3
          );
        },
      });
    },
    [departing, navigate, reduceMotion, runWarp]
  );

  /* ── Markup ──────────────────────────────────────────────────────────── */
  const doors = DOORS.map((door) => (
    <section
      key={door.id}
      className="door"
      data-side={door.side}
      aria-label={door.title}
      ref={(node) => {
        doorRefs.current[door.id] = node;
      }}
    >
      <button
        type="button"
        className="door-card"
        onClick={() => choose(door)}
        // Prefetching on approach means the destination is usually already in
        // memory by the time the gate is even reached.
        onPointerEnter={() => preloadRoute[door.id]?.()}
        onFocus={() => preloadRoute[door.id]?.()}
      >
        <span className="door-card-bloom" aria-hidden="true" />
        <span className="door-card-edge" aria-hidden="true" />

        <span className="door-card-icon" aria-hidden="true">
          <LottieIcon name={door.lottie} size="58%" primary="--accent-2" secondary="--accent-3" trigger="hover" />
        </span>

        <span className="door-marker">{door.marker}</span>
        <span className="door-title">{door.title}</span>
        <span className="door-caption">{door.caption}</span>

        <span className="door-cta">
          {door.cta}
          <Icon name="forward" size="1em" />
        </span>
      </button>
    </section>
  ));

  return (
    <PageShell
      timeline="portal"
      chrome={false}
      scrim={false}
      title="Time Machine — Travel to your past, or to 2050"
      description="Two doors. One takes you back. One takes you to 2050. Which do you want to know?"
      className="portal"
    >
      <div className="portal-root" ref={rootRef}>
        <div className="portal-stage" ref={stageRef}>
          <div className="portal-hero">
            <img
              className="hero-image"
              ref={heroRef}
              src={heroUrl}
              srcSet={`${heroSmallUrl} 1200w, ${heroUrl} 2400w`}
              sizes="100vw"
              alt=""
              width={2400}
              height={1351}
              fetchpriority="high"
              decoding="async"
              draggable={false}
            />

            <span className="hero-core" aria-hidden="true" />
            <span className="hero-sweep" aria-hidden="true" />
            <span className="hero-walk" aria-hidden="true" />
            <span className="hero-vignette" aria-hidden="true" />
          </div>

          <div className="portal-ui" ref={uiRef}>
            <header className="portal-masthead">
              <span className="portal-wordmark">
                <LottieIcon name="hourglass" size="1.45em" primary="--ink" secondary="--accent-4" trigger="hover" />
                Time Machine
              </span>
              <span className="portal-cross" aria-hidden="true">
                ×
              </span>
              <span className="portal-wordmark portal-wordmark-future">2050</span>
            </header>

            {!isNarrow ? <div className="portal-doors">{doors}</div> : null}
          </div>
        </div>

        {isNarrow ? <div className="portal-doors portal-doors-stacked">{doors}</div> : null}

        <footer className="portal-foot">
          <span>Both journeys are works of fiction. Neither is a prediction.</span>
          <span className="portal-foot-links">
            {[
              { to: '/archive', label: 'Archive', icon: 'archive' },
              { to: '/how-it-works', label: 'How it works', icon: 'help' },
              { to: '/privacy', label: 'Privacy', icon: 'shield' },
            ].map((link) => (
              <Link key={link.to} to={link.to}>
                <Icon name={link.icon} size={12} />
                {link.label}
              </Link>
            ))}
          </span>
        </footer>
      </div>
    </PageShell>
  );
}

export default PortalPage;
