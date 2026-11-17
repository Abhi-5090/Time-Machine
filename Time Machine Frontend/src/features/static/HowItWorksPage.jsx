import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../../components/layout/PageShell';
import { SectionHeading, Badge } from '../../components/ui/primitives';
import { Reveal, RevealGroup, RevealItem } from '../../motion/Reveal';
import { LottieIcon } from '../../lottie/LottieIcon';
import { Icon } from '../../components/ui/Icon';

const PIPELINE = [
  {
    icon: 'scan',
    title: 'Your answers become a seed',
    body: 'Name, date, sign and preferences are hashed into a single seed. Every structural decision — archetype, era or habitat, name, role, setting — is a pure function of that seed, which is why the same answers always produce the same life.',
  },
  {
    icon: 'compass',
    title: 'A skeleton is resolved first',
    body: 'Before any language model is asked for a sentence, the server has already decided who you are. That keeps readings reproducible, keeps the offline mode consistent with the live one, and means a retry never quietly changes the story.',
  },
  {
    icon: 'hourglass',
    title: 'The prose is written to that skeleton',
    body: 'The model receives the resolved facts and a strict brief: imaginative fiction for the past, grounded speculative fiction for 2050, and in both cases explicit instructions never to claim truth about your real life.',
  },
  {
    icon: 'aperture',
    title: 'The portrait is rendered last',
    body: 'An image model composes a portrait from the same facts. If you consented to share a photograph, an identity-preserving edit is attempted first so the face stays recognisably yours.',
  },
];

const PROMISES = [
  ['No account', 'There is no sign-up, no password and no email. A reading belongs to whoever holds its link and token.'],
  ['Photos are opt-in twice', 'Once to consent, once to upload. Without both, nothing is sent.'],
  ['30-day expiry', 'Readings delete themselves automatically. You can delete one sooner at any time.'],
  ['Nothing is trained on', 'Your photograph is used to render your portrait and for nothing else.'],
];

export default function HowItWorksPage() {
  return (
    <PageShell
      timeline="portal"
      title="How it works — Time Machine"
      description="What happens between your answers and the chronicle that comes back."
    >
      <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          eyebrow="Under the hood"
          title="How a life gets written"
          description="Both doors run the same pipeline. Only the vocabulary, the prompts and the portrait direction differ."
          align="center"
        />

        <RevealGroup
          style={{
            display: 'grid',
            gap: 'var(--space-5)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            marginBlock: 'var(--space-8)',
          }}
        >
          {PIPELINE.map((step, index) => (
            <RevealItem key={step.title} className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <LottieIcon name={step.icon} size={40} primary="--accent" secondary="--accent-2" trigger="visible" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>{step.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.7 }}>{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="card" style={{ padding: 'var(--space-6)' }}>
          <SectionHeading eyebrow="The deal" title="What we will and will not do" />
          <ul style={{ marginTop: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)' }}>
            {PROMISES.map(([title, body]) => (
              <li key={title} style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <Badge accent>{title}</Badge>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.7 }}>{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="card" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.7rem', marginBottom: 'var(--space-4)' }}>
            What this is not
          </h2>
          <div className="prose" style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
            <p>
              Time Machine does not prove reincarnation, report verified history, or explain anything
              that has actually happened to you. 2050 is not a forecast, not a prediction, and not
              advice about your health, money, career or relationships.
            </p>
            <p>
              Both sides are fiction, written to be moving rather than true. They are built never to
              attribute real suffering to past actions and never to make claims about what your life
              will contain. If a reading ever reads as though it is telling you something factual
              about yourself, it has failed at its own brief.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 'var(--space-8)',
          }}
        >
          <Link to="/past/new" className="btn btn-secondary btn-lg">
            Begin a reading
          </Link>
          <Link to="/future/new" className="btn btn-primary btn-lg">
            Run a projection
            <Icon name="forward" size={15} />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
