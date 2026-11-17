import React, { useMemo } from 'react';

/**
 * Renders generated prose as paragraphs.
 *
 * Model output arrives as one string with blank lines in it; dropping it into a
 * single <p> would produce a wall of text, and `white-space: pre-wrap` would
 * keep the line breaks but lose proper paragraph spacing and the drop cap. So
 * the string is split on blank lines and each block becomes a real paragraph.
 */
export function Prose({ text, className, style }) {
  const paragraphs = useMemo(
    () =>
      String(text || '')
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean),
    [text]
  );

  if (paragraphs.length === 0) return null;

  return (
    <div className={className} style={style}>
      {paragraphs.map((paragraph, index) => (
        // Generated prose has no stable ids; index is the only key available
        // and the list never reorders.
        // eslint-disable-next-line react/no-array-index-key
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
