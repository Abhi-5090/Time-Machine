import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Stat } from '../../components/ui/primitives';
import { PortraitFrame } from '../../components/reading/PortraitFrame';
import { Reveal, RevealGroup, RevealItem } from '../../motion/Reveal';
import { ScrambleText, CountUp } from '../../motion/interactions';
import { Prose } from './Prose';
import '../future/future.css';
import './results.css';
import { Icon } from '../../components/ui/Icon';

const SECTIONS = [
  { key: 'arrival', index: '01', title: 'Arrival', icon: 'scan' },
  { key: 'dailyLife', index: '02', title: 'The Work', icon: 'console' },
  { key: 'breakthrough', index: '03', title: 'The Breakthrough', icon: 'rocket' },
  { key: 'connections', index: '04', title: 'Connections', icon: 'persona' },
  { key: 'horizon', index: '05', title: 'Horizon', icon: 'world' },
];

/**
 * The 2050 dossier.
 *
 * Structurally the twin of the past report — same sticky portrait, same
 * chapters, same pull quote — but presented as an instrument read-out rather
 * than printed matter. The signals row and the trajectory are the two things
 * this timeline has that the past does not, and both are drawn from values the
 * server computed deterministically for this reading.
 */
export function FutureReport({ reading }) {
  const persona = reading.futureProfile || {};
  const signals = reading.signals || [];
  const markers = reading.timelineMarkers || [];

  return (
    <article className="report container">
      <header className="report-head">
        <div>
          <p className="readout">
            <ScrambleText text={`PROJECTION // ${persona.targetYear || 2050}`} />
          </p>
          <h1 className="report-title">{persona.personaName || reading.title}</h1>
          <div className="report-meta">
            {persona.roleTitle ? <Badge accent>{persona.roleTitle}</Badge> : null}
            {persona.habitatName ? <Badge>{persona.habitatName}</Badge> : null}
            {persona.archetypeName ? <Badge>{persona.archetypeName}</Badge> : null}
            {persona.projectedAge ? <Badge>Age {persona.projectedAge}</Badge> : null}
          </div>
        </div>
      </header>

      {/* ── Signals ──────────────────────────────────────────────────── */}
      {signals.length ? (
        <RevealGroup className="signals" style={{ marginBottom: 'var(--space-7)' }}>
          {signals.map((signal) => (
            <RevealItem key={signal.key}>
              <Stat
                label={signal.label}
                value={<CountUp value={signal.value} />}
                unit={signal.unit}
                delta={signal.delta}
                note={signal.note}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      ) : null}

      <div className="report-layout">
        {/* ── Capture & dossier ──────────────────────────────────────── */}
        <aside className="report-aside">
          <PortraitFrame
            src={reading.portraitUrl}
            alt={`A 2050 portrait of ${persona.personaName || 'the subject of this projection'}`}
            timeline="future"
            placeholder={reading.providerMode === 'mock' && Boolean(reading.degradedReason)}
            eyebrow="Capture // 2050"
            caption={
              reading.profileSummary?.hasReferencePhoto
                ? 'Resolved from the photograph you shared, restaged in 2050.'
                : 'A resolved likeness. No photograph was used.'
            }
          />

          <div className="panel hud-frame">
            <p className="readout" style={{ marginBottom: 'var(--space-4)' }}>
              Dossier
            </p>
            <dl style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {[
                ['Designation', persona.personaName],
                ['Post', persona.roleTitle],
                ['Habitat', persona.habitatName],
                ['Life stage', persona.lifeStage],
                ['Station', persona.environment],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="eyebrow" style={{ fontSize: '0.62rem' }}>
                      {label}
                    </dt>
                    <dd style={{ margin: '3px 0 0', fontSize: '0.93rem', color: 'var(--ink-soft)' }}>{value}</dd>
                  </div>
                ))}
            </dl>

            {persona.technologies?.length ? (
              <>
                <hr className="rule" style={{ marginBlock: 'var(--space-4)' }} />
                <p className="eyebrow" style={{ fontSize: '0.62rem', marginBottom: 'var(--space-2)' }}>
                  Daily instruments
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {persona.technologies.map((technology) => (
                    <Badge key={technology}>{technology}</Badge>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {/* ── Trajectory ───────────────────────────────────────────── */}
          {markers.length ? (
            <div className="panel">
              <p className="readout" style={{ marginBottom: 'var(--space-4)' }}>
                <Icon name="trajectory" size={12} />
                Trajectory
              </p>
              <div className="timeline-track">
                {markers.map((marker) => (
                  <div className="timeline-entry" key={`${marker.year}-${marker.title}`}>
                    <span className="trajectory-year">{marker.year}</span>
                    <h3 style={{ fontSize: '1rem', marginBlock: '2px var(--space-2)' }}>{marker.title}</h3>
                    <p style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {marker.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        {/* ── Chronicle ──────────────────────────────────────────────── */}
        <div>
          {persona.definingTension ? (
            <Reveal className="panel hud-frame" style={{ marginBottom: 'var(--space-6)' }}>
              <p className="readout" style={{ marginBottom: 'var(--space-3)' }}>
                The tension at the centre
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
                {persona.definingTension}
              </p>
            </Reveal>
          ) : null}

          {SECTIONS.filter((section) => reading.futureSections?.[section.key]).map((section, index) => (
            <Reveal
              key={section.key}
              className="chapter"
              data-opening={index === 0 ? "true" : undefined}
              delay={index * 0.03}
            >
              <div className="chapter-rule">
                <Icon name={section.icon} size={13} style={{ color: 'var(--accent)' }} />
                <span className="chapter-numeral" style={{ fontFamily: 'var(--font-mono)' }}>
                  {section.index} / 05
                </span>
                <span className="chapter-rule-line" />
              </div>
              <h2 className="chapter-title">{section.title}</h2>
              <Prose text={reading.futureSections[section.key]} className="chapter-body" />
            </Reveal>
          ))}

          {reading.futureSignalsNarrative?.length ? (
            <Reveal style={{ paddingTop: 'var(--space-7)' }}>
              <div className="chapter-rule">
                <Icon name="signal" size={13} style={{ color: 'var(--accent)' }} />
                <span className="chapter-numeral" style={{ fontFamily: 'var(--font-mono)' }}>
                  Signals
                </span>
                <span className="chapter-rule-line" />
              </div>
              <h2 className="chapter-title">What this life is built on</h2>

              <div className="themes" style={{ marginTop: 'var(--space-5)' }}>
                {reading.futureSignalsNarrative.map((signal) => (
                  <div key={signal.theme} className="panel panel-interactive">
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-3)', color: 'var(--accent)' }}>
                      {signal.theme}
                    </h3>
                    <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                      {signal.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {reading.presentDayDirective ? (
            <Reveal className="pullquote">
              <p className="readout" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                Directive
              </p>
              <p>{reading.presentDayDirective}</p>
            </Reveal>
          ) : null}

          <Reveal className="panel hud-frame" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <p className="readout" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              The other door
            </p>
            <h3 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-3)' }}>Now look the other way</h3>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '46ch', marginInline: 'auto', fontSize: '0.95rem' }}>
              You have seen where you end up. Time Machine asks the same question pointed backward —
              and the pair of them read as one life.
            </p>
            <Link to="/past" className="btn btn-primary" style={{ marginTop: 'var(--space-5)' }}>
              Travel backward
              <Icon name="forward" size={15} />
            </Link>
          </Reveal>

          <p className="report-disclaimer">{reading.disclaimer}</p>
        </div>
      </div>
    </article>
  );
}
