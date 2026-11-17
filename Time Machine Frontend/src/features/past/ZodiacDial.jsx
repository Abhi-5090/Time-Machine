import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';
import { textGlyph } from '../../lib/glyph';

/**
 * The dial: the twelve signs set around an engraved ring.
 *
 * It gives the hero a right-hand column with something to say, and it echoes
 * the gate the reader just walked through — the same circular form, drawn as
 * an instrument rather than as a portal.
 *
 * The decorative rings turn slowly; the glyphs do not. A rotating ring of
 * letterforms is unreadable, and the point of the dial is that you can find
 * your own sign on it.
 */

const RADIUS = 168;
const CENTRE = 220;

function pointOn(radius, index) {
  const angle = ((index * 30 - 90) * Math.PI) / 180;
  return {
    x: CENTRE + radius * Math.cos(angle),
    y: CENTRE + radius * Math.sin(angle),
  };
}

export function ZodiacDial({ signs = [] }) {
  const scopeRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(null);

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.to('.dial-spin-slow', {
        rotation: 360,
        duration: 190,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });
      gsap.to('.dial-spin-reverse', {
        rotation: -360,
        duration: 130,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      // The glyphs settle into place once, outward from the top.
      gsap.from('.dial-sign', {
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        stagger: 0.045,
        ease: 'power3.out',
        transformOrigin: '50% 50%',
      });
    }, scopeRef);

    return () => context.revert();
  }, [reduceMotion]);

  const current = active ? signs.find((sign) => sign.name === active) : null;

  return (
    <figure className="dial" ref={scopeRef}>
      <svg viewBox="0 0 440 440" role="img" aria-label="The twelve signs">
        <defs>
          <radialGradient id="dialFace" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="var(--surface-raised)" />
            <stop offset="72%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--surface-sunken)" />
          </radialGradient>
        </defs>

        {/* Face */}
        <circle cx={CENTRE} cy={CENTRE} r="206" fill="url(#dialFace)" stroke="var(--rule)" />

        {/* Engraved rings */}
        <g className="dial-spin-slow">
          <circle cx={CENTRE} cy={CENTRE} r="200" fill="none" stroke="var(--rule-strong)" strokeDasharray="1 7" />
          <circle cx={CENTRE} cy={CENTRE} r="134" fill="none" stroke="var(--rule)" strokeDasharray="3 11" />
        </g>
        <g className="dial-spin-reverse">
          <circle cx={CENTRE} cy={CENTRE} r="190" fill="none" stroke="var(--rule)" />
          <circle cx={CENTRE} cy={CENTRE} r="112" fill="none" stroke="var(--rule-strong)" strokeDasharray="14 9" />
        </g>
        <circle cx={CENTRE} cy={CENTRE} r="146" fill="none" stroke="var(--rule-strong)" />

        {/* Division marks, one per sign */}
        {signs.map((sign, index) => {
          const outer = pointOn(196, index);
          const inner = pointOn(182, index);
          return (
            <line
              key={`tick-${sign.name}`}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="var(--rule-strong)"
            />
          );
        })}

        {/* The signs themselves */}
        {signs.map((sign, index) => {
          const spot = pointOn(RADIUS, index);
          const isActive = active === sign.name;
          return (
            <g
              key={sign.name}
              className="dial-sign"
              data-active={isActive || undefined}
              onPointerEnter={() => setActive(sign.name)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(sign.name)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="button"
              aria-label={`${sign.name}, ${sign.element}`}
            >
              <circle cx={spot.x} cy={spot.y} r="24" className="dial-sign-well" />
              <text x={spot.x} y={spot.y} className="dial-sign-glyph" textAnchor="middle" dominantBaseline="central">
                {textGlyph(sign.symbol)}
              </text>
            </g>
          );
        })}

        {/* Centre read-out */}
        <text x={CENTRE} y={CENTRE - 16} className="dial-centre-label" textAnchor="middle">
          {current ? current.element.toUpperCase() : 'THE TWELVE'}
        </text>
        <text x={CENTRE} y={CENTRE + 22} className="dial-centre-name" textAnchor="middle">
          {current ? current.name : 'Find yours'}
        </text>
        {current?.dates ? (
          <text x={CENTRE} y={CENTRE + 48} className="dial-centre-dates" textAnchor="middle">
            {current.dates}
          </text>
        ) : null}
      </svg>

      <figcaption className="dial-caption">
        Every sign opens on a different era, a different calling, a different name.
      </figcaption>
    </figure>
  );
}
