import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { SectionHeading, Ornament, Badge } from '../../components/ui/primitives';
import { Reveal, RevealGroup, RevealItem } from '../../motion/Reveal';
import { SplitText } from '../../motion/SplitText';
import { LottieIcon } from '../../lottie/LottieIcon';
import { useSigns } from '../../lib/useCatalog';
import { textGlyph } from '../../lib/glyph';
import gsap from 'gsap';
import { useScrollScene, heroRecede } from '../../motion/useScrollScene';
import { ZodiacDial } from './ZodiacDial';
import { EASE_OUT, DURATION } from '../../motion/easings';
import './past.css';
import { Icon } from '../../components/ui/Icon';

const ELEMENTS = ['All', 'Fire', 'Earth', 'Air', 'Water'];

const DELIVERABLES = [
  {
    icon: 'compass',
    title: 'A soul archetype',
    body: 'One of nine figures — the Sage, the Guardian, the Wanderer — drawn from your sign, your chosen themes and nothing else.',
  },
  {
    icon: 'hourglass',
    title: 'A five-chapter chronicle',
    body: 'Origins, daily life, the turning point, the people who mattered, and how it ended. Written as a life, not as a horoscope.',
  },
  {
    icon: 'bloom',
    title: 'A painted portrait',
    body: 'A cinematic portrait of the person in the story. Share a photograph and your own likeness carries through into it.',
  },
];

const STEPS = [
  {
    icon: 'signature',
    title: 'Give the chart something to read',
    body: 'A name you like being called, your birth date, and your sign. Birth time and place are optional and only add texture.',
  },
  {
    icon: 'penNib',
    title: 'Choose the shape of the story',
    body: 'An archetype or let the stars pick one. A theme, a genre, and the era you want to wake up in.',
  },
  {
    icon: 'identity',
    title: 'Decide about your face',
    body: 'Uploading a photograph is entirely optional and requires an explicit, separate consent. Without one, a face is imagined.',
  },
  {
    icon: 'chronicle',
    title: 'Read what comes back',
    body: 'The chronicle arrives chapter by chapter, then the portrait. Keep it, export it, or delete it and every asset with it.',
  },
];

export default function PastLandingPage() {
  const signs = useSigns();
  const [element, setElement] = useState('All');

  const sceneRef = useScrollScene(() => {
    // The hero gives way as the reader leaves it.
    heroRecede('.past-hero .container > div');

    // The masthead rules draw across as the page settles.
    gsap.fromTo(
      '.past-masthead',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out', delay: 0.2 }
    );

    // The specimen plate drifts slightly against the scroll, which is what
    // makes a flat page of type feel like it has depth.
    gsap.to('.specimen', {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: '.specimen', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  });

  const filtered = useMemo(
    () => (element === 'All' ? signs : signs.filter((sign) => sign.element === element)),
    [signs, element]
  );

  return (
    <PageShell
      timeline="past"
      scrim={false}
      title="Time Machine — Step into your past"
      description="An imaginative, astrology-inspired chronicle of a life you might have lived, with a portrait of the person who lived it."
    >
      <div ref={sceneRef}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="past-hero">
        <div className="container">
          <div className="past-masthead">
            <span>Time Machine</span>
            <span>Volume I — The Backward Door</span>
            <span>A work of fiction</span>
          </div>

          <div className="past-hero-grid">
            <div className="past-hero-copy">
              <div className="past-eyebrow">
                <LottieIcon name="hourglass" size={46} primary="--accent" secondary="--accent-2" />
                <span className="eyebrow">Behind you</span>
              </div>

              <h1 className="past-hero-title display-hero">
                <SplitText text="You have been" delay={0.1} />
                <br />
                <em>
                  <SplitText text="someone before." delay={0.3} />
                </em>
              </h1>

              <p className="past-hero-lede lede">
                Not provably. Not historically. But give the chart a date and a disposition and it
                will set down a whole life for you — a name, an era, a profession, one decision that
                changed everything — and paint the face that lived it.
              </p>

              <div className="past-hero-actions">
                <Link to="/past/new" className="btn btn-primary btn-lg">
                  <Icon name="begin" size={15} />
                  Begin a reading
                  <Icon name="forward" size={14} />
                </Link>
                <Link to="/future" className="btn btn-secondary btn-lg">
                  Or go to 2050
                </Link>
              </div>

              <p className="past-hero-note">
                <Icon name="shield" size={15} />
                No account. Nothing shared. Delete it all in one click.
              </p>
            </div>

            <div className="past-hero-dial">
              <ZodiacDial signs={signs} />
            </div>
          </div>
        </div>
      </section>

      {/* ── What you receive ─────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-9)' }}>
        <SectionHeading
          split
          eyebrow="What arrives"
          title="Three things, carefully made"
          description="Every reading is deterministic from your inputs — the same answers always summon the same soul."
        />

        <RevealGroup
          style={{
            display: 'grid',
            gap: 'var(--space-5)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            marginTop: 'var(--space-7)',
          }}
        >
          {DELIVERABLES.map((item) => (
            <RevealItem key={item.title} className="paper" style={{ padding: 'var(--space-6)' }}>
              <span className="plate-tile">
                <LottieIcon
                  name={item.icon}
                  size={54}
                  primary="--accent"
                  secondary="--accent-2"
                  trigger="visible"
                />
              </span>
              <h3 style={{ margin: 'var(--space-5) 0 var(--space-3)', fontSize: '1.55rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.72 }}>{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Specimen page ────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <Reveal>
          <div className="specimen">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <Ornament>Specimen — Chapter III</Ornament>
              <h3 style={{ marginTop: 'var(--space-4)', fontSize: 'clamp(1.6rem, 1.3rem + 1.4vw, 2.4rem)' }}>
                The Turning Point
              </h3>
              <p className="eyebrow" style={{ marginTop: 'var(--space-2)' }}>
                Lysander of the Whispering Spire · Ancient Era
              </p>
            </div>

            <div className="specimen-body">
              <p className="dropcap">
                The defining moment arrived during the Great Conjunction of the Twin Comets — a year
                marked by prolonged drought and rising apprehension among neighbouring provinces. When
                the local rulers demanded that the sanctuary&rsquo;s hidden granaries be seized for
                wartime stockpiling, Lysander stepped forward to bar the carved gates, armed not with
                steel but with ancient treaties and unyielding moral clarity.
              </p>
              <p>
                Standing beneath an eclipsed moon before assembled legions, they demonstrated how the
                alignment foretold a change in wind and rain within three dawns. They persuaded the
                governors to share reserves rather than resort to siege. When the rains broke the drought
                exactly on the third twilight, bloodshed was averted, and the authority of patience was
                consecrated above the authority of force.
              </p>
            </div>

            <p
              style={{
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--rule)',
                fontSize: '0.78rem',
                color: 'var(--ink-muted)',
                textAlign: 'center',
              }}
            >
              An illustrative excerpt. Your chronicle will share none of these particulars.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── The twelve ───────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          split
          eyebrow="The twelve"
          title="Every sign opens a different door"
          description="Hover the dial above, or read them in order. Your sign sets the era, the calling and the name."
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginBlock: 'var(--space-5) var(--space-6)',
          }}
          role="tablist"
          aria-label="Filter signs by element"
        >
          {ELEMENTS.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={element === name}
              onClick={() => setElement(name)}
              className={`btn btn-sm ${element === name ? 'btn-primary' : 'btn-secondary'}`}
            >
              {name}
            </button>
          ))}
        </div>

        <motion.ul layout style={{ borderTop: '1px solid var(--rule-strong)' }}>
          {filtered.map((sign, index) => (
            <motion.li
              key={sign.name}
              layout
              className="sign-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: Math.min(index * 0.03, 0.3) }}
            >
              <span className="sign-glyph zodiac-glyph" aria-hidden="true">
                {textGlyph(sign.symbol)}
              </span>
              <span>
                <span className="sign-name">{sign.name}</span>
                {sign.symbolicThemes?.length ? (
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      color: 'var(--ink-muted)',
                      marginTop: 2,
                    }}
                  >
                    {sign.symbolicThemes.join(' · ')}
                  </span>
                ) : null}
              </span>
              <span className="sign-meta">
                {sign.element}
                {sign.dates ? ` · ${sign.dates}` : ''}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          split
          eyebrow="How it goes"
          title="Four steps, about two minutes"
          description="Nothing is required beyond a star sign. Every other answer only sharpens what comes back."
        />

        <div className="step-grid">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} className="step" delay={index * 0.05}>
              <span className="step-mark">
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="plate-tile plate-tile-sm">
                  <Icon name={step.icon} size={17} />
                </span>
              </span>
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: 'var(--space-3)' }}>{step.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.98rem', lineHeight: 1.72 }}>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <Reveal className="paper" style={{ padding: 'clamp(var(--space-6), 5vw, var(--space-9))', textAlign: 'center' }}>
          <Ornament>Begin</Ornament>
          <h2 style={{ margin: 'var(--space-5) 0 var(--space-4)', fontSize: 'clamp(2rem, 1.5rem + 2.4vw, 3.4rem)' }}>
            Who were you, before all this?
          </h2>
          <p
            style={{
              color: 'var(--ink-soft)',
              maxWidth: '52ch',
              marginInline: 'auto',
              marginBottom: 'var(--space-6)',
            }}
          >
            It takes about two minutes to answer, and rather longer to stop thinking about.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Link to="/past/new" className="btn btn-primary btn-lg">
              <Icon name="begin" size={16} />
              Begin a reading
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary btn-lg">
              <Icon name="book" size={16} />
              How it works
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              justifyContent: 'center',
              marginTop: 'var(--space-6)',
            }}
          >
            <Badge icon={<Icon name="portrait" size={11} />}>Portrait included</Badge>
            <Badge icon={<Icon name="shield" size={11} />}>Consent required for photos</Badge>
            <Badge icon={<Icon name="delete" size={11} />}>Deleted on request</Badge>
          </div>
        </Reveal>
      </section>
      </div>
    </PageShell>
  );
}
