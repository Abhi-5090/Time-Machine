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
    title: 'A card with your name on it',
    body: 'One sheet with your picture, the details you gave us, and a short story about who you were. You can save it or print it.',
  },
  {
    icon: 'hourglass',
    title: 'A short, simple story',
    body: 'Four or five lines: who you were, the time you lived in, the work you did, and the one day that mattered most.',
  },
  {
    icon: 'bloom',
    title: 'A picture of your old face',
    body: 'A painted picture of the person in the story. Add a photo and the face will look like yours.',
  },
];

const STEPS = [
  {
    icon: 'signature',
    title: 'Tell us five things',
    body: 'Your name, your star sign, and the day, time and place you were born. The time and place are optional.',
  },
  {
    icon: 'identity',
    title: 'Add a photo, if you want to',
    body: 'A photo is not needed. Add one and we will use your own face. We ask before we use it, and we delete it with your card.',
  },
  {
    icon: 'penNib',
    title: 'The stars pick the rest',
    body: 'You do not choose who you were, where you lived or what you did. Your sign and your birth day decide all of it.',
  },
  {
    icon: 'chronicle',
    title: 'Take your card home',
    body: 'Your card shows up in about a minute. Download it as a picture, share the link, or delete it and everything with it.',
  },
];

export default function PastLandingPage() {
  const signs = useSigns();
  const [element, setElement] = useState('All');

  const sceneRef = useScrollScene(() => {
    // The hero gives way as the reader leaves it, measured against the whole
    // section. The selector matches two children — the masthead and the hero
    // spread — so the trigger is named rather than inferred from the first of
    // them, which is a thin rule and would compress the fade into a flicker.
    heroRecede('.past-hero .container > div', { trigger: '.past-hero' });

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
      description="A made-up story about a life you might have lived, on one card, with a picture of the person who lived it."
    >
      <div ref={sceneRef}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="past-hero">
        <div className="container">
          <div className="past-masthead">
            <span>Time Machine</span>
            <span>The door that goes back</span>
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
                Not for real, and not in any history book. But tell us your star sign and the day you
                were born, and the stars will give you a whole life — a name, a time, a job, and the one
                day that changed everything — and draw the face that lived it.
              </p>

              <div className="past-hero-actions">
                <Link to="/past/new" className="btn btn-primary btn-lg">
                  <Icon name="begin" size={15} />
                  Start
                  <Icon name="forward" size={14} />
                </Link>
                <Link to="/future" className="btn btn-secondary btn-lg">
                  Or go to 2050
                </Link>
              </div>

              <p className="past-hero-note">
                <Icon name="shield" size={15} />
                No sign-up. Nothing is shared. Delete it all with one click.
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
          title="Three things you get"
          description="The same answers always give the same life. Your star sign and your birth day decide everything."
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
              <Ornament>An example</Ornament>
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
          description="Your sign decides the time you lived in, the work you did and the name you went by."
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
          title="Two steps, about one minute"
          description="All we need is your star sign. Everything else is up to you, and the stars pick the rest."
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
            It takes about a minute to fill in, and a lot longer to stop thinking about.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Link to="/past/new" className="btn btn-primary btn-lg">
              <Icon name="begin" size={16} />
              Start
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
            <Badge icon={<Icon name="portrait" size={11} />}>Picture included</Badge>
            <Badge icon={<Icon name="shield" size={11} />}>We ask before using a photo</Badge>
            <Badge icon={<Icon name="delete" size={11} />}>Delete it any time</Badge>
          </div>
        </Reveal>
      </section>
      </div>
    </PageShell>
  );
}
