import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardShell } from '../wizard/WizardShell';
import { useWizard } from '../wizard/useWizard';
import { PhotoStep, ConsentBlock, ReviewList } from '../wizard/steps';
import { Field, Input } from '../../components/ui/Field';
import { SignGrid } from '../../components/ui/Choice';
import { Ornament } from '../../components/ui/primitives';
import { StarsPick } from '../wizard/StarsPick';
import { useCatalog, FALLBACK_SIGNS } from '../../lib/useCatalog';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../lib/api';
import { rememberReading } from '../../lib/archive';
import '../wizard/wizard.css';
import './past.css';

/*
 * Two steps, and only the five things a reader actually knows about
 * themselves. Everything that used to be a choice — the archetype, the theme,
 * the tone, the era, the painting style, the framing — is now decided from the
 * star sign and the birth details, which is what a reader expects a star
 * reading to do anyway. Asking them to pick made the queue at a stall slow and
 * made the result feel chosen rather than given.
 *
 * The defaults below are the same values the server already applies, kept
 * explicit so it is obvious at a glance that nothing is being left unset.
 */
const INITIAL = {
  preferredName: '',
  dateOfBirth: '',
  selectedZodiacSign: '',
  birthTime: '',
  birthplace: '',
  photoConsent: false,
  photoAssetId: null,
  photoPreview: null,
  photoName: null,
  consentFiction: false,
  consentReading: false,
  preferences: {
    archetypeId: 'auto',
    mainTheme: 'wisdom',
    storyGenre: 'reflective',
    historicalSetting: 'system_select',
    portraitStyle: 'cinematic_mystical_realism',
    portraitFraming: 'close_up',
    readingDepth: 'full',
  },
};

export default function PastWizard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { catalog } = useCatalog();
  const [submitting, setSubmitting] = useState(false);

  const signs = catalog?.zodiacSigns?.length ? catalog.zodiacSigns : FALLBACK_SIGNS;

  const steps = useMemo(
    () => [
      {
        id: 'you',
        label: 'About you',
        title: 'Tell us about you',
        description:
          'Five quick things. Your name, your star sign, and when and where you were born. That is all we need.',
        validate: (answers) => (answers.selectedZodiacSign ? null : 'Pick your star sign to carry on.'),
        render: ({ answers, set }) => (
          <>
            <Field label="Your name" hint="We will put this on your card.">
              <Input
                value={answers.preferredName}
                onChange={(event) => set({ preferredName: event.target.value })}
                placeholder="Type your name"
                maxLength={60}
                autoComplete="given-name"
              />
            </Field>

            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Your star sign
              </p>
              <SignGrid
                signs={signs}
                value={answers.selectedZodiacSign}
                onChange={(name) => set({ selectedZodiacSign: name })}
              />
            </div>

            <Ornament>When and where you were born</Ornament>

            <Field label="Date of birth" hint="Pick the day you were born.">
              <Input
                type="date"
                value={answers.dateOfBirth}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => set({ dateOfBirth: event.target.value })}
              />
            </Field>

            <div
              style={{
                display: 'grid',
                gap: 'var(--space-4)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              }}
            >
              <Field label="Time of birth" hint="Only if you know it. You can skip this.">
                <Input
                  type="time"
                  value={answers.birthTime}
                  onChange={(event) => set({ birthTime: event.target.value })}
                />
              </Field>

              <Field label="Place of birth" hint="Your town or city is enough.">
                <Input
                  value={answers.birthplace}
                  onChange={(event) => set({ birthplace: event.target.value })}
                  placeholder="Hyderabad, India"
                  maxLength={100}
                />
              </Field>
            </div>
          </>
        ),
      },

      {
        id: 'photo',
        label: 'Your photo',
        title: 'Add your photo',
        description:
          'Your photo is what your picture gets drawn from. Skip it and your card comes with a drawn stand-in in place of a picture.',
        validate: (answers) =>
          !answers.consentFiction || !answers.consentReading
            ? 'Please tick both boxes before we start.'
            : null,
        render: ({ answers, set }) => (
          <>
            <PhotoStep
              answers={answers}
              set={set}
              copy={{
                skipNote:
                  'You can skip this. Without a photo we do not make a picture, so your card shows a drawn stand-in instead. Everything else on it is the same.',
              }}
            />

            <StarsPick
              items={[
                'Who you were in your past life',
                'The time and the place you lived in',
                'The work you did every day',
                'How your picture is painted',
              ]}
            />

            <Ornament>One last check</Ornament>

            <ReviewList
              rows={[
                { icon: 'signature', label: 'Name', value: answers.preferredName || 'The stars will name you' },
                { icon: 'star', label: 'Star sign', value: answers.selectedZodiacSign },
                { icon: 'calendar', label: 'Born on', value: answers.dateOfBirth || 'Not given' },
                { icon: 'chamber', label: 'Born at', value: answers.birthTime || 'Not given' },
                { icon: 'place', label: 'Born in', value: answers.birthplace || 'Not given' },
                { icon: 'identity', label: 'Photo', value: answers.photoAssetId ? 'Added' : 'Not added' },
              ]}
            />

            <ConsentBlock
              answers={answers}
              set={set}
              fictionTitle="I know this is a story, not a fact"
              fictionBody="This is a fun story made up for you, based on your star sign. It does not prove past lives, it is not real history, and it does not explain anything that has happened in your life."
            />
          </>
        ),
      },
    ],
    [signs]
  );

  const wizard = useWizard({ steps, initialAnswers: INITIAL });

  const submit = async () => {
    const { answers } = wizard;
    setSubmitting(true);

    try {
      const response = await api.createReading({
        timeline: 'past',
        profile: {
          preferredName: answers.preferredName || '',
          dateOfBirth: answers.dateOfBirth || null,
          selectedZodiacSign: answers.selectedZodiacSign,
          zodiacInputMode: 'manual_symbolic_choice',
          birthTime: answers.birthTime || '',
          birthplace: answers.birthplace || '',
          photoAssetId: answers.photoAssetId || null,
        },
        preferences: answers.preferences,
        consent: {
          readingProcessing: true,
          fictionalReadingAcknowledged: true,
          photoProcessing: Boolean(answers.photoConsent && answers.photoAssetId),
        },
      });

      const { readingId } = response.data;
      rememberReading({
        readingId,
        timeline: 'past',
        status: 'processing',
        name: answers.preferredName || 'Unnamed',
        sign: answers.selectedZodiacSign,
      });

      navigate(`/reading/${readingId}/reveal`);
    } catch (error) {
      toast(error.message || 'We could not start your reading. Please try again.', { tone: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <WizardShell
      timeline="past"
      title="Start your reading — Time Machine"
      description="Answer a few things and the stars will write your past life for you."
      wizard={wizard}
      submitting={submitting}
      submitLabel="Open the door"
      onSubmit={submit}
      footnote="We keep your card for 30 days. You can delete it any time, and everything made for it goes with it."
    />
  );
}
