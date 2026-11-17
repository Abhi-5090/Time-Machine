import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageShell } from '../../components/layout/PageShell';
import { SectionHeading } from '../../components/ui/primitives';
import { Reveal, RevealGroup, RevealItem } from '../../motion/Reveal';
import { SplitText } from '../../motion/SplitText';
import { ScrambleText, CountUp, Marquee } from '../../motion/interactions';
import { LottieIcon } from '../../lottie/LottieIcon';
import { Countdown } from './Countdown';
import { useCatalog } from '../../lib/useCatalog';
import { iconFor } from '../../lib/iconMap';
import gsap from 'gsap';
import { useScrollScene, heroRecede } from '../../motion/useScrollScene';
import { EASE_OUT, DURATION } from '../../motion/easings';
import './future.css';
import { Icon } from '../../components/ui/Icon';

const OUTPUTS = [
  {
    icon: 'radar',
    title: 'A persona and a post',
    body: 'One of nine 2050 archetypes, with a specific job title, a habitat and the technology you handle every day.',
  },
  {
    icon: 'scan',
    title: 'A chronicle in five parts',
    body: 'Arrival, daily life, the breakthrough and what it cost, the people who matter, and the horizon past 2050.',
  },
  {
    icon: 'aperture',
    title: 'A capture at 2050 fidelity',
    body: 'An environmental portrait in your chosen aesthetic. Share a photograph and the face stays yours.',
  },
];

const TICKER = [
  'ORBITAL RING // POP. 41,200',
  'ATMOSPHERIC CARBON −18% vs 2025',
  'LUNAR CORRIDOR: 14 TRANSITS/WEEK',
  'GRID AUTONOMY 94%',
  'REWILDED CORRIDORS: 2.1M KM²',
  'DESALINATION ONLINE: 380 SITES',
  'MACHINE CONSCIENCE BOARD — SESSION 1,204',
];

const PREVIEW_TRAJECTORY = [
  { year: '2027', title: 'The unglamorous start', body: 'The sideways move that turns out to be the only door.' },
  { year: '2031', title: 'First real responsibility', body: 'Something that breaks if you handle it badly.' },
  { year: '2036', title: 'The pivot', body: 'Expensive, disruptive, and the hinge everything after depends on.' },
  { year: '2042', title: 'The breakthrough', body: 'The problem nobody else wanted to own.' },
  { year: '2050', title: 'Where the signal lands', body: 'The life that was built out of all of it.' },
];

export default function FutureLandingPage() {
  const { catalog } = useCatalog();

  const sceneRef = useScrollScene(() => {
    heroRecede('.future-hero .container', { distance: -120, scale: 0.94 });

    // The year pulls away faster than the copy beneath it, so leaving the hero
    // reads as travelling past the number rather than scrolling a page.
    gsap.to('.future-hero-year', {
      y: -160,
      ease: 'none',
      scrollTrigger: { trigger: '.future-hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    });

    // Habitat panels rake in as the section crosses the fold.
    gsap.utils.toArray('.habitat').forEach((panel, index) => {
      gsap.fromTo(
        panel,
        { y: 40, opacity: 0.25 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top 92%', end: 'top 58%', scrub: 0.6 },
          delay: index * 0.02,
        }
      );
    });

    // The trajectory nodes step in one at a time as the spine is descended.
    gsap.utils.toArray('.trajectory-node').forEach((node) => {
      gsap.fromTo(
        node,
        { x: -18, opacity: 0.3 },
        {
          x: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top 90%', end: 'top 62%', scrub: 0.5 },
        }
      );
    });
  });
  const habitats = (catalog?.future?.habitats || []).filter((habitat) => habitat.id !== 'system_select');

  return (
    <PageShell
      timeline="future"
      scrim={false}
      title="2050 — Do you want to know about your future?"
      description="Twenty-five years forward. A role, a habitat, a breakthrough and what it cost — written as grounded speculative fiction, with a portrait to match."
    >
      <div ref={sceneRef}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="future-hero">
        <div className="container" style={{ width: '100%' }}>
          <motion.p
            className="readout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            style={{ marginBottom: 'var(--space-5)' }}
          >
            <ScrambleText text="SIGNAL ACQUIRED — PROJECTION READY" />
          </motion.p>

          <h1 className="future-hero-year display-hero">
            <SplitText text="2050" delay={0.15} stagger={0.06} mode="char" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.45 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 1.1rem + 2vw, 2.6rem)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-4)',
            }}
          >
            Do you want to know about your future?
          </motion.p>

          <motion.p
            className="future-hero-lede lede"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.6 }}
          >
            Twenty-five years forward. Not a forecast — a piece of grounded speculative fiction with
            you in it: where you live, what you build, who you answer to, and the one decision in the
            early forties that the rest of it hangs on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.75 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBlock: 'var(--space-6)' }}
          >
            <Link to="/future/new" className="btn btn-primary btn-lg">
              Run the projection
              <Icon name="forward" size={16} />
            </Link>
            <Link to="/past" className="btn btn-secondary btn-lg">
              Or travel backward
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.9 }}
            style={{ maxWidth: 560 }}
          >
            <p className="eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
              Time to arrival
            </p>
            <Countdown />
          </motion.div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────── */}
      <section
        aria-hidden="true"
        style={{
          borderBlock: '1px solid var(--rule)',
          paddingBlock: 'var(--space-3)',
          background: 'color-mix(in srgb, var(--bg-deep) 60%, transparent)',
        }}
      >
        <Marquee speed={52}>
          {TICKER.map((item) => (
            <span
              key={item}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                letterSpacing: '0.14em',
                color: 'var(--ink-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── Outputs ──────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-9)' }}>
        <SectionHeading
          eyebrow="Return payload"
          title="Three artefacts from the far side"
          description="Every projection is deterministic from your inputs. The same answers always resolve the same life."
        />

        <RevealGroup className="grid-auto" style={{ marginTop: 'var(--space-7)' }}>
          {OUTPUTS.map((item, index) => (
            <RevealItem key={item.title} className="panel panel-interactive hud-frame">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <LottieIcon name={item.icon} size={42} primary="--accent" secondary="--accent-2" trigger="visible" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ink-muted)' }}>
                  {String(index + 1).padStart(2, '0')} / 03
                </span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-3)' }}>{item.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.93rem', lineHeight: 1.65 }}>{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Habitats ─────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          eyebrow="Where people live"
          title="Six habitats, one of them yours"
          description="Choose where 2050 finds you, or let the projection resolve it from everything else you answer."
        />

        <RevealGroup className="grid-auto" style={{ marginTop: 'var(--space-7)' }}>
          {habitats.map((habitat, index) => (
            <RevealItem key={habitat.id} className="habitat">
              <span className="habitat-glow" aria-hidden="true" />
              <span className="habitat-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="habitat-icon" aria-hidden="true">
                <Icon name={iconFor('habitat', habitat.id)} size={18} />
              </span>
              <h3 style={{ fontSize: '1.2rem', position: 'relative' }}>{habitat.label}</h3>
              <p style={{ color: 'var(--accent)', fontSize: '0.85rem', position: 'relative' }}>{habitat.tagline}</p>
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.86rem', lineHeight: 1.6, position: 'relative' }}>
                {habitat.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Trajectory ───────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-7)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            alignItems: 'start',
          }}
        >
          <div>
            <SectionHeading
              eyebrow="Twenty-five years"
              title="It does not start in 2050"
              description="Your projection comes with the whole trajectory — the detours, the pivot, and the year the work finally lands."
            />
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginTop: 'var(--space-6)',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.6rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  <CountUp value={9} />
                </span>
                <span className="eyebrow" style={{ display: 'block' }}>
                  2050 archetypes
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.6rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  <CountUp value={6} />
                </span>
                <span className="eyebrow" style={{ display: 'block' }}>
                  Habitats
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.6rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  <CountUp value={8} />
                </span>
                <span className="eyebrow" style={{ display: 'block' }}>
                  Sectors
                </span>
              </div>
            </div>
          </div>

          <Reveal className="trajectory">
            {PREVIEW_TRAJECTORY.map((node) => (
              <div className="trajectory-node" key={node.year}>
                <span className="trajectory-year">{node.year}</span>
                <h3 style={{ fontSize: '1.1rem', marginBlock: 'var(--space-1) var(--space-2)' }}>{node.title}</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>{node.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <Reveal
          className="panel hud-frame"
          style={{ padding: 'clamp(var(--space-6), 5vw, var(--space-9))', textAlign: 'center' }}
        >
          <p className="readout" style={{ justifyContent: 'center', marginBottom: 'var(--space-5)' }}>
            <ScrambleText text="AWAITING INPUT" />
          </p>

          <h2 style={{ fontSize: 'clamp(2rem, 1.5rem + 2.6vw, 3.6rem)', marginBottom: 'var(--space-4)' }}>
            <span className="caret">Twenty-five years from now</span>
          </h2>

          <p
            style={{
              color: 'var(--ink-soft)',
              maxWidth: '54ch',
              marginInline: 'auto',
              marginBottom: 'var(--space-6)',
            }}
          >
            Two minutes of answers. One life, written in full. You can delete all of it afterwards and
            nothing remains.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Link to="/future/new" className="btn btn-primary btn-lg">
              <Icon name="console" size={16} />
              Run the projection
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary btn-lg">
              <Icon name="signal" size={16} />
              How it works
            </Link>
          </div>

          <p
            style={{
              marginTop: 'var(--space-6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '0.8rem',
              color: 'var(--ink-muted)',
            }}
          >
            <Icon name="shield" size={14} />
            Speculative fiction. Not a forecast, and not advice.
          </p>
        </Reveal>
      </section>
      </div>
    </PageShell>
  );
}
