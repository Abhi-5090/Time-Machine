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
    title: 'Your answers turn into a number',
    body: 'Your name, your birth day and your star sign are turned into one number. That number picks who you were, where you lived and what you did. This is why the same answers always give you the same life — nothing is random.',
  },
  {
    icon: 'compass',
    title: 'We decide the facts first',
    body: 'Before the AI writes a single word, we have already worked out your name, your job and your home. That way, if you ask for a new picture, the story stays exactly the same.',
  },
  {
    icon: 'hourglass',
    title: 'Then the AI writes the story',
    body: 'The AI gets those facts and clear rules: write a made-up story in plain words, and never claim anything is true about your real life.',
  },
  {
    icon: 'aperture',
    title: 'The picture is drawn last',
    body: 'The picture is drawn from the same facts. If you added a photo, we start from your own face so the person on the card still looks like you.',
  },
];

const PROMISES = [
  ['No sign-up', 'No account, no password, no email. Your card belongs to whoever has the link.'],
  ['We ask twice about photos', 'Once to say yes, once to pick the file. If you skip either, nothing is sent.'],
  ['Gone in 30 days', 'Cards delete themselves. You can delete yours sooner, any time you like.'],
  ['We do not train on you', 'Your photo is used to draw your picture, and for nothing else.'],
];

export default function HowItWorksPage() {
  return (
    <PageShell
      timeline="portal"
      title="How it works — Time Machine"
      description="What happens between your answers and the card that comes back."
    >
      <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <SectionHeading
          eyebrow="Under the hood"
          title="How your card gets made"
          description="Both doors work the same way. Only the words and the picture are different."
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
