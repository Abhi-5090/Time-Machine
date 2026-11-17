import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const TARGET = Date.UTC(2050, 0, 1, 0, 0, 0);

function split(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * Distance to 1 January 2050.
 *
 * The seconds column is the only thing on the page that moves on its own, and
 * it is doing real work: it makes 2050 feel like a place you are travelling
 * toward rather than a theme. Under reduced motion the ticking stops and the
 * remaining days are shown as a settled figure.
 */
export function Countdown() {
  const reduceMotion = useReducedMotion();
  const [remaining, setRemaining] = useState(() => split(TARGET - Date.now()));

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(() => setRemaining(split(TARGET - Date.now())), 1000);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const cells = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds },
  ];

  return (
    <div
      className="countdown"
      role="timer"
      aria-live="off"
      aria-label={`${remaining.days} days until the year 2050`}
    >
      {cells.map((cell) => (
        <div className="countdown-cell" key={cell.label}>
          <span className="countdown-value">
            {cell.label === 'Days' ? cell.value.toLocaleString() : String(cell.value).padStart(2, '0')}
          </span>
          <span className="countdown-label">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}
