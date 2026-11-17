import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { PortraitPlaceholder } from '../../components/reading/PortraitPlaceholder';
import { textGlyph } from '../../lib/glyph';
import './reportCard.css';

/*
 * The report card.
 *
 * This is the output now. Everything a reader leaves with is on one sheet:
 * their portrait, the details they gave us, and four or five sentences saying
 * who they were or who they become. The long chronicle still exists, but it is
 * folded away below — at a stall nobody reads nine sections on a phone, and a
 * sheet you can hold is the thing people actually want to take home.
 *
 * The sheet is laid out at a fixed 794 x 1123 px, which is A4 at 96dpi, and
 * then scaled to whatever room the screen has. Fixed pixels rather than
 * percentages because this node is also the export target: the PNG is a render
 * of this exact element, so its proportions have to be the paper's, not the
 * viewport's. Scaling the wrapper instead of the sheet keeps the export
 * untouched by how wide the browser happens to be.
 */

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2005-07-14" → "14 July 2005", parsed as a plain day, never as a timestamp. */
function formatDay(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!match) return null;
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  return name ? `${Number(day)} ${name} ${year}` : null;
}

/** "14:30" → "2:30 pm". A 24-hour clock is not what most people read. */
function formatTime(value) {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || ''));
  if (!match) return null;
  const hours = Number(match[1]);
  if (!Number.isFinite(hours) || hours > 23) return null;
  const suffix = hours < 12 ? 'am' : 'pm';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${match[2]} ${suffix}`;
}

/**
 * Fits the sheet to the space it is given.
 *
 * A ResizeObserver rather than a window listener, because the sheet also has
 * to re-fit when a sidebar or a disclosure changes the column width without
 * the window changing at all.
 */
function useSheetScale() {
  const frameRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const fit = () => {
      const width = frame.clientWidth;
      if (width > 0) setScale(Math.min(1, width / SHEET_WIDTH));
    };

    fit();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }

    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return { frameRef, scale };
}

/**
 * Shrinks the name until it fits its column without breaking a word in half.
 *
 * "Venkataraman" set at 40px in Unbounded is wider than the column, and
 * `overflow-wrap: break-word` honestly answered that by splitting it across
 * two lines mid-word. Nobody wants their name cut in half on a certificate.
 *
 * Measuring the rendered element is the only reliable way to do this: the two
 * timelines use different display faces at very different widths, so any
 * character-count heuristic would be wrong for one of them.
 */
function useFittedText(text, maxSize, minSize) {
  const ref = useRef(null);
  const [size, setSize] = useState(maxSize);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let next = maxSize;
    node.style.fontSize = `${next}px`;
    // scrollWidth exceeds clientWidth only when a word cannot fit the line,
    // which is exactly the case worth shrinking for.
    while (next > minSize && node.scrollWidth > node.clientWidth) {
      next -= 1;
      node.style.fontSize = `${next}px`;
    }
    setSize(next);
  }, [text, maxSize, minSize]);

  return { ref, size };
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="sheet-detail">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export const ReportCard = React.forwardRef(function ReportCard({ reading }, sheetRef) {
  const { frameRef, scale } = useSheetScale();
  const isFuture = (reading.timeline || 'past') === 'future';

  const profile = reading.profileSummary || {};
  const character = reading.characterProfile || {};
  const persona = reading.futureProfile || {};

  const name = profile.preferredName?.trim() || (isFuture ? persona.personaName : character.characterName) || 'A traveller';
  const sign = profile.selectedSign || profile.derivedSign || reading.celestialSignature?.selectedSign;
  const signSymbol = reading.celestialSignature?.symbol;

  const role = isFuture
    ? persona.roleTitle
    : [character.occupation, character.eraName].filter(Boolean).join(' · ');

  const paragraph =
    reading.summary?.trim() ||
    (isFuture ? reading.futureSections?.arrival : reading.storySections?.origins) ||
    '';

  const heading = isFuture ? 'Your life in 2050' : 'Who you were';
  const nameFit = useFittedText(name, 40, 22);

  // Short, readable, and stable: the same reading always prints the same
  // number, so two people comparing cards at a stall can tell them apart.
  const serial = String(reading.readingId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();

  return (
    <div className="sheet-frame" ref={frameRef} style={{ height: SHEET_HEIGHT * scale }}>
      <div
        className="sheet"
        ref={sheetRef}
        data-timeline={isFuture ? 'future' : 'past'}
        style={{
          width: SHEET_WIDTH,
          height: SHEET_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="sheet-edge" aria-hidden="true" />

        <header className="sheet-head">
          <div>
            <p className="sheet-brand">Time Machine</p>
            <h1 className="sheet-kind">{isFuture ? 'Your 2050 Report' : 'Your Past Life Report'}</h1>
          </div>
          <div className="sheet-serial">
            <span>Card no.</span>
            <strong>{serial || '——————'}</strong>
          </div>
        </header>

        <div className="sheet-rule" aria-hidden="true" />

        <section className="sheet-body">
          <figure className="sheet-portrait-col">
            <div className="sheet-portrait">
              {reading.portraitUrl ? (
                <img src={reading.portraitUrl} alt={`Portrait of ${name}`} />
              ) : (
                <PortraitPlaceholder
                  timeline={isFuture ? 'future' : 'past'}
                  className="sheet-portrait__stand-in"
                />
              )}
            </div>

            {/* Said plainly, and on the sheet itself, so nobody holding the
                card has to wonder whether that is meant to be them. */}
            {reading.portraitUrl ? null : (
              <figcaption className="sheet-portrait__note">
                No photo was shared, so this picture is a stand-in.
              </figcaption>
            )}
          </figure>

          <div className="sheet-identity">
            <p className="sheet-eyebrow">This card belongs to</p>
            <p className="sheet-name" ref={nameFit.ref} style={{ fontSize: nameFit.size }}>
              {name}
            </p>
            {role ? <p className="sheet-role">{role}</p> : null}

            <dl className="sheet-details">
              <Detail label="Date of birth" value={formatDay(profile.dateOfBirth)} />
              <Detail
                label="Star sign"
                value={sign ? `${signSymbol ? `${textGlyph(signSymbol)} ` : ''}${sign}` : null}
              />
              {isFuture && persona.projectedAge ? (
                <Detail label="Your age in 2050" value={`${persona.projectedAge} years old`} />
              ) : null}
              <Detail label="Time of birth" value={formatTime(profile.birthTime)} />
              <Detail label="Place of birth" value={profile.birthplace} />
            </dl>
          </div>
        </section>

        <section className="sheet-story">
          <h2 className="sheet-story__heading">
            <Icon name={isFuture ? 'rocket' : 'book'} size={15} />
            {heading}
          </h2>
          <p className="sheet-story__text">{paragraph}</p>

        </section>

        {/* Sits behind the paragraph, so a short story gets a stamp and a long
            one simply covers it. */}
        <div className="sheet-watermark" aria-hidden="true">
          {isFuture ? '2050' : signSymbol ? textGlyph(signSymbol) : '\u2726'}
        </div>

        <footer className="sheet-foot">
          <p className="sheet-foot__note">
            {isFuture
              ? 'This is a made-up story about the year 2050. It is for fun. It is not a real prediction about your life.'
              : 'This is a made-up story based on your star sign. It is for fun. It is not real history.'}
          </p>
          <p className="sheet-foot__mark">
            <Icon name="star" size={11} />
            Time Machine
          </p>
        </footer>
      </div>
    </div>
  );
});
