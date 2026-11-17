import React from 'react';
import { PageShell } from '../../components/layout/PageShell';
import { SectionHeading } from '../../components/ui/primitives';
import { Reveal } from '../../motion/Reveal';

/**
 * Shared layout for the policy pages.
 *
 * Sections are plain data so the two documents stay consistent with each other
 * and neither can drift into its own typography.
 */
export function LegalPage({ title, eyebrow, updated, intro, sections, pageTitle }) {
  return (
    <PageShell timeline="portal" title={pageTitle} description={intro}>
      <div className="container-narrow" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading eyebrow={eyebrow} title={title} description={intro} />

        <p className="eyebrow" style={{ marginTop: 'var(--space-5)' }}>
          Last updated {updated}
        </p>

        <div style={{ marginTop: 'var(--space-7)', display: 'grid', gap: 'var(--space-7)' }}>
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.03}>
              <h2 style={{ fontSize: '1.45rem', marginBottom: 'var(--space-4)' }}>{section.heading}</h2>
              <div className="prose" style={{ color: 'var(--ink-soft)', fontSize: '0.96rem', lineHeight: 1.75 }}>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
