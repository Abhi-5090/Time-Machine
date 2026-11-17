import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { textGlyph } from '../../lib/glyph';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from './Icon';

/**
 * A grid of selectable cards, used for every meaningful choice in both wizards.
 *
 * Implemented as a radiogroup rather than a list of buttons so arrow keys work
 * and screen readers announce "3 of 9". The selection marker is a drawn tick
 * rather than a border-colour change alone, because colour on its own is not a
 * state indicator everyone can see.
 */
export function ChoiceGrid({
  options,
  value,
  onChange,
  name,
  columns,
  renderMeta,
  className,
  'aria-label': ariaLabel,
}) {
  const style = columns
    ? { gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${columns}px), 1fr))` }
    : undefined;

  return (
    <div className={cn('choice-grid', className)} style={style} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            name={name}
            aria-checked={selected}
            data-selected={selected}
            className="choice"
            onClick={() => onChange(option.id)}
          >
            <Icon name="check" className="choice-tick" size={15} aria-hidden="true" />
            {option.icon ? (
              <span className="choice-icon" aria-hidden="true">
                <Icon name={option.icon} size={17} />
              </span>
            ) : null}
            <span className="choice-title">{option.label}</span>
            {option.note ? <span className="choice-note">{option.note}</span> : null}
            {renderMeta ? renderMeta(option, selected) : null}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The zodiac picker.
 *
 * A separate component because the signs need their glyph at display size and a
 * tighter grid than prose-bearing options — forcing them through ChoiceGrid
 * would mean a prop that only one caller ever sets.
 */
export function SignGrid({ signs, value, onChange }) {
  return (
    <div
      className="choice-grid"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 124px), 1fr))' }}
      role="radiogroup"
      aria-label="Star sign"
    >
      {signs.map((sign, index) => {
        const selected = value === sign.name;
        return (
          <motion.button
            key={sign.name}
            type="button"
            role="radio"
            aria-checked={selected}
            data-selected={selected}
            className="choice"
            onClick={() => onChange(sign.name)}
            style={{ alignItems: 'center', textAlign: 'center', gap: 'var(--space-1)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: index * 0.035 }}
          >
            <span
              aria-hidden="true"
              className="zodiac-glyph"
              style={{
                fontSize: '1.7rem',
                lineHeight: 1,
                color: selected ? 'var(--accent)' : 'var(--ink-muted)',
                transition: 'color var(--dur-fast) var(--ease-soft)',
              }}
            >
              {textGlyph(sign.symbol)}
            </span>
            <span className="choice-title">{sign.name}</span>
            <span className="choice-note">{sign.element}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** A consent or opt-in checkbox with a title and explanatory body. */
export function Checkbox({ checked, onChange, title, children, id }) {
  return (
    <label className="check" data-checked={checked} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className="check-box" aria-hidden="true">
        <Icon name="check"
          size={13}
          style={{
            opacity: checked ? 1 : 0,
            transform: checked ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
          }}
        />
      </span>
      <span className="check-body">
        {title ? <span className="check-title">{title}</span> : null}
        {children}
      </span>
    </label>
  );
}
