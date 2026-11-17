import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../components/ui/Icon';
import { EASE_OUT, DURATION } from '../../motion/easings';

/**
 * Says out loud what the reader is no longer being asked to choose.
 *
 * Removing the choice steps made the wizard quick, but silence about it reads
 * as missing features rather than as a decision. Naming each thing the stars
 * settle turns the shorter form into the point of the thing.
 */
export function StarsPick({ items, title = 'The stars pick the rest' }) {
  return (
    <motion.div
      className="panel stars-pick"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      <p className="stars-pick__title">
        <Icon name="magic" size={14} />
        {title}
      </p>

      <ul className="stars-pick__list">
        {items.map((item) => (
          <li key={item}>
            <Icon name="star" size={11} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="stars-pick__note">
        You do not have to choose any of these. Your sign, your birth day and your photo tell us
        enough.
      </p>
    </motion.div>
  );
}
