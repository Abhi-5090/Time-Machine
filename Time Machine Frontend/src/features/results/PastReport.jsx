import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Ornament } from '../../components/ui/primitives';
import { PortraitFrame } from '../../components/reading/PortraitFrame';
import { Reveal } from '../../motion/Reveal';
import { Prose } from './Prose';
import '../past/past.css';
import './results.css';
import { Icon } from '../../components/ui/Icon';

const CHAPTERS = [
  { key: 'origins', numeral: 'Chapter I', title: 'Origins & Awakening', icon: 'star' },
  { key: 'dailyLife', numeral: 'Chapter II', title: 'The Daily Round', icon: 'chamber' },
  { key: 'turningPoint', numeral: 'Chapter III', title: 'The Turning Point', icon: 'compass' },
  { key: 'relationships', numeral: 'Chapter IV', title: 'Those Who Walked Beside', icon: 'theater' },
  { key: 'conclusion', numeral: 'Chapter V', title: 'The Quiet Legacy', icon: 'landmark' },
];

/**
 * The past-life chronicle, set as printed matter.
 *
 * The portrait sits in a sticky column on wide screens so it stays with the
 * reader through all five chapters; below 1000px it leads the page instead,
 * because a sticky image on a phone just eats the viewport.
 */
export function PastReport({ reading }) {
  const character = reading.characterProfile || {};
  const signature = reading.celestialSignature || {};

  return (
    <article className="report container">
      <header className="report-head">
        <div>
          <p className="eyebrow">Time Machine · Past-life chronicle</p>
          <h1 className="report-title">{reading.title || character.characterName}</h1>
          <div className="report-meta">
            {reading.archetype?.name ? <Badge accent>{reading.archetype.name}</Badge> : null}
            {signature.selectedSign ? <Badge>{signature.selectedSign}</Badge> : null}
            {character.eraName ? <Badge>{character.eraName}</Badge> : null}
            {character.occupation ? <Badge>{character.occupation}</Badge> : null}
          </div>
        </div>
      </header>

      <div className="report-layout">
        {/* ── Portrait & dossier ─────────────────────────────────────── */}
        <aside className="report-aside">
          <PortraitFrame
            src={reading.portraitUrl}
            alt={`An imagined portrait of ${character.characterName || 'the subject of this chronicle'}`}
            timeline="past"
            placeholder={reading.providerMode === 'mock' && Boolean(reading.degradedReason)}
            eyebrow="The portrait"
            caption={
              reading.profileSummary?.hasReferencePhoto
                ? 'Painted from the photograph you shared, restaged in the era of the chronicle.'
                : 'You did not share a photo, so no picture was made. This is a stand-in.'
            }
          />

          <div className="paper" style={{ padding: 'var(--space-5)' }}>
            <Ornament>The subject</Ornament>
            <dl style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-3)' }}>
              {[
                ['Name', character.characterName],
                ['Calling', character.occupation],
                ['Era', character.eraName],
                ['Setting', character.setting],
                ['Element', signature.element],
                ['Ruler', signature.ruler],
                ['Realm', signature.mythicRealm],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="eyebrow" style={{ fontSize: '0.64rem' }}>
                      {label}
                    </dt>
                    <dd style={{ margin: '2px 0 0', fontSize: '0.95rem' }}>{value}</dd>
                  </div>
                ))}
            </dl>

            {character.characterTraits?.length ? (
              <>
                <hr className="rule" style={{ marginBlock: 'var(--space-4)' }} />
                <p className="eyebrow" style={{ fontSize: '0.64rem', marginBottom: 'var(--space-2)' }}>
                  Bearing
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {character.characterTraits.map((trait) => (
                    <Badge key={trait}>{trait}</Badge>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </aside>

        {/* ── Chronicle ──────────────────────────────────────────────── */}
        <div>
          {character.coreConflict ? (
            <Reveal className="paper" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              <p className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                The tension at the centre
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
                {character.coreConflict}
              </p>
            </Reveal>
          ) : null}

          {CHAPTERS.filter((chapter) => reading.storySections?.[chapter.key]).map((chapter, index) => (
            <Reveal
              key={chapter.key}
              className="chapter"
              data-opening={index === 0 ? "true" : undefined}
              delay={index * 0.03}
            >
              <div className="chapter-rule">
                <Icon name={chapter.icon} size={13} style={{ color: 'var(--accent)' }} />
                <span className="chapter-numeral">{chapter.numeral}</span>
                <span className="chapter-rule-line" />
              </div>
              <h2 className="chapter-title">{chapter.title}</h2>
              <Prose text={reading.storySections[chapter.key]} className="chapter-body" />
            </Reveal>
          ))}

          {reading.symbolicKarmicThemes?.length ? (
            <Reveal style={{ paddingTop: 'var(--space-7)' }}>
              <div className="chapter-rule">
                <Icon name="quote" size={13} style={{ color: 'var(--accent)' }} />
                <span className="chapter-numeral">Reflections</span>
                <span className="chapter-rule-line" />
              </div>
              <h2 className="chapter-title">What the story is carrying</h2>

              <div className="themes" style={{ marginTop: 'var(--space-5)' }}>
                {reading.symbolicKarmicThemes.map((theme) => (
                  <div key={theme.theme} className="paper" style={{ padding: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-3)', color: 'var(--accent)' }}>
                      {theme.theme}
                    </h3>
                    <p style={{ color: 'var(--ink-soft)', fontSize: '0.94rem', lineHeight: 1.7 }}>
                      {theme.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {reading.presentDayReflection ? (
            <Reveal className="pullquote">
              <p className="eyebrow" style={{ marginBottom: 'var(--space-4)', fontStyle: 'normal' }}>
                To sit with
              </p>
              <p>{reading.presentDayReflection}</p>
            </Reveal>
          ) : null}

          <Reveal
            className="paper"
            style={{ padding: 'var(--space-6)', textAlign: 'center', marginTop: 'var(--space-7)' }}
          >
            <Ornament>The other door</Ornament>
            <h3 style={{ margin: 'var(--space-4) 0 var(--space-3)', fontSize: '1.6rem' }}>
              Now find out where you end up
            </h3>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '46ch', marginInline: 'auto', fontSize: '0.95rem' }}>
              You have seen who you might have been. 2050 is the same question, pointed the other way.
            </p>
            <Link to="/future" className="btn btn-primary" style={{ marginTop: 'var(--space-5)' }}>
              Go to 2050
              <Icon name="forward" size={15} />
            </Link>
          </Reveal>

          <p className="report-disclaimer">{reading.disclaimer}</p>
        </div>
      </div>
    </article>
  );
}
