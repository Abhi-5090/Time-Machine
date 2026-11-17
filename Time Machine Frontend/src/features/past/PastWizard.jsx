import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardShell } from '../wizard/WizardShell';
import { useWizard } from '../wizard/useWizard';
import { PhotoStep, ConsentBlock, ReviewList } from '../wizard/steps';
import { Field, Input } from '../../components/ui/Field';
import { ChoiceGrid, SignGrid } from '../../components/ui/Choice';
import { Ornament } from '../../components/ui/primitives';
import { useCatalog, FALLBACK_SIGNS } from '../../lib/useCatalog';
import { withIcons } from '../../lib/iconMap';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../lib/api';
import { rememberReading } from '../../lib/archive';
import '../wizard/wizard.css';
import './past.css';

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

/** Tropical sun-sign boundaries, used only to show the reader what their date implies. */
const BOUNDARIES = [
  [1, 20, 'Aquarius'], [2, 19, 'Pisces'], [3, 21, 'Aries'], [4, 20, 'Taurus'],
  [5, 21, 'Gemini'], [6, 21, 'Cancer'], [7, 23, 'Leo'], [8, 23, 'Virgo'],
  [9, 23, 'Libra'], [10, 23, 'Scorpio'], [11, 22, 'Sagittarius'], [12, 22, 'Capricorn'],
];

function deriveSign(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  let sign = 'Capricorn';
  for (const [boundaryMonth, boundaryDay, name] of BOUNDARIES) {
    if (month > boundaryMonth || (month === boundaryMonth && day >= boundaryDay)) sign = name;
  }
  return sign;
}

const labelFor = (options, id, key = 'label') =>
  options?.find((option) => option.id === id)?.[key] ?? id;

export default function PastWizard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { catalog } = useCatalog();
  const [submitting, setSubmitting] = useState(false);

  const signs = catalog?.zodiacSigns?.length ? catalog.zodiacSigns : FALLBACK_SIGNS;
  const past = catalog?.past;

  const steps = useMemo(
    () => [
      {
        id: 'identity',
        label: 'Identity',
        title: 'Who is this reading for?',
        description:
          'A name to call you by, and the sign whose door you want to walk through. Nothing here leaves this reading.',
        validate: (answers) => (answers.selectedZodiacSign ? null : 'Choose a star sign to continue.'),
        render: ({ answers, set }) => (
          <>
            <Field
              label="Preferred name"
              hint="Used as the voice of the chronicle. Leave it blank and the stars will name you themselves."
            >
              <Input
                value={answers.preferredName}
                onChange={(event) => set({ preferredName: event.target.value })}
                placeholder="What should the chronicle call you?"
                maxLength={60}
                autoComplete="given-name"
              />
            </Field>

            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Star sign
              </p>
              <SignGrid
                signs={signs}
                value={answers.selectedZodiacSign}
                onChange={(name) => set({ selectedZodiacSign: name })}
              />
            </div>
          </>
        ),
      },

      {
        id: 'birth',
        label: 'Coordinates',
        title: 'Optional celestial coordinates',
        description:
          'Every field on this step may be skipped. They add texture to the reading; none of them are required.',
        validate: () => null,
        render: ({ answers, set }) => {
          const derived = deriveSign(answers.dateOfBirth);
          const mismatch =
            derived && answers.selectedZodiacSign && derived !== answers.selectedZodiacSign;

          return (
            <>
              <Field label="Date of birth" hint="Only the day and month are used, and only as a symbol.">
                <Input
                  type="date"
                  value={answers.dateOfBirth}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => set({ dateOfBirth: event.target.value })}
                />
              </Field>

              {mismatch ? (
                <p className="field-hint" style={{ color: 'var(--color-caution)' }}>
                  That date falls under {derived}, but you chose {answers.selectedZodiacSign}. Your
                  choice is kept — the reading follows the sign you picked, not the calendar.
                </p>
              ) : null}

              <div
                style={{
                  display: 'grid',
                  gap: 'var(--space-4)',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                }}
              >
                <Field label="Time of birth" hint="If you happen to know it.">
                  <Input
                    type="time"
                    value={answers.birthTime}
                    onChange={(event) => set({ birthTime: event.target.value })}
                  />
                </Field>

                <Field label="Place of birth" hint="A city or a region is plenty.">
                  <Input
                    value={answers.birthplace}
                    onChange={(event) => set({ birthplace: event.target.value })}
                    placeholder="Hyderabad, India"
                    maxLength={100}
                  />
                </Field>
              </div>
            </>
          );
        },
      },

      {
        id: 'story',
        label: 'The story',
        title: 'What shape should the life take?',
        description:
          'These choices steer the chronicle. Leave them as they are and the alignment decides for you.',
        validate: () => null,
        render: ({ answers, setPreference }) => (
          <>
            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Soul archetype
              </p>
              <ChoiceGrid
                aria-label="Soul archetype"
                options={withIcons(past?.archetypes, 'pastArchetype', (item) => ({
                  id: item.id,
                  label: item.displayName,
                  note: item.shortDescription,
                }))}
                value={answers.preferences.archetypeId}
                onChange={(id) => setPreference('archetypeId', id)}
                columns={230}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gap: 'var(--space-5)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              }}
            >
              <div>
                <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                  Guiding theme
                </p>
                <ChoiceGrid
                  aria-label="Guiding theme"
                  options={withIcons(past?.themes, 'theme')}
                  value={answers.preferences.mainTheme}
                  onChange={(id) => setPreference('mainTheme', id)}
                  columns={190}
                />
              </div>

              <div>
                <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                  Tone
                </p>
                <ChoiceGrid
                  aria-label="Tone"
                  options={withIcons(past?.genres, 'genre')}
                  value={answers.preferences.storyGenre}
                  onChange={(id) => setPreference('storyGenre', id)}
                  columns={190}
                />
              </div>
            </div>

            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Era
              </p>
              <ChoiceGrid
                aria-label="Era"
                options={withIcons(past?.settings, 'era', (item) => ({
                  id: item.id,
                  label: item.label,
                  note: item.note,
                }))}
                value={answers.preferences.historicalSetting}
                onChange={(id) => setPreference('historicalSetting', id)}
                columns={230}
              />
            </div>
          </>
        ),
      },

      {
        id: 'portrait',
        label: 'Portrait',
        title: 'The face in the painting',
        description:
          'Choose how the portrait is made. Sharing a photograph is entirely optional and asks for its own consent.',
        validate: () => null,
        render: ({ answers, set, setPreference }) => (
          <>
            <div
              style={{
                display: 'grid',
                gap: 'var(--space-5)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              }}
            >
              <div>
                <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                  Painting style
                </p>
                <ChoiceGrid
                  aria-label="Painting style"
                  options={withIcons(past?.portraitStyles, 'aesthetic')}
                  value={answers.preferences.portraitStyle}
                  onChange={(id) => setPreference('portraitStyle', id)}
                  columns={220}
                />
              </div>

              <div>
                <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                  Framing
                </p>
                <ChoiceGrid
                  aria-label="Framing"
                  options={withIcons(catalog?.shared?.portraitFramings, 'framing')}
                  value={answers.preferences.portraitFraming}
                  onChange={(id) => setPreference('portraitFraming', id)}
                  columns={160}
                />
              </div>
            </div>

            <Ornament>Your likeness</Ornament>

            <PhotoStep
              answers={answers}
              set={set}
              copy={{
                skipNote:
                  'No photograph is fine. The portrait will imagine a face entirely, and the painting is just as complete.',
              }}
            />
          </>
        ),
      },

      {
        id: 'review',
        label: 'Review',
        title: 'Before the chamber opens',
        description: 'A last look at what the stars are being given.',
        validate: (answers) =>
          !answers.consentFiction || !answers.consentReading
            ? 'Both acknowledgements are required before a reading can begin.'
            : null,
        render: ({ answers, set }) => (
          <>
            <ReviewList
              rows={[
                { icon: 'signature', label: 'Name', value: answers.preferredName || 'Chosen by the stars' },
                { icon: 'star', label: 'Sign', value: answers.selectedZodiacSign },
                { icon: 'calendar', label: 'Born', value: answers.dateOfBirth || 'Not shared' },
                { icon: 'chamber', label: 'Birth time', value: answers.birthTime || 'Not shared' },
                { icon: 'place', label: 'Birthplace', value: answers.birthplace || 'Not shared' },
                {
                  icon: 'persona',
                  label: 'Archetype',
                  value: labelFor(
                    (past?.archetypes || []).map((item) => ({ id: item.id, label: item.displayName })),
                    answers.preferences.archetypeId
                  ),
                },
                { icon: 'book', label: 'Theme', value: labelFor(past?.themes, answers.preferences.mainTheme) },
                { icon: 'quote', label: 'Tone', value: labelFor(past?.genres, answers.preferences.storyGenre) },
                { icon: 'columns', label: 'Era', value: labelFor(past?.settings, answers.preferences.historicalSetting) },
                {
                  icon: 'portrait',
                  label: 'Portrait',
                  value: `${labelFor(past?.portraitStyles, answers.preferences.portraitStyle)} · ${labelFor(
                    catalog?.shared?.portraitFramings,
                    answers.preferences.portraitFraming
                  )}`,
                },
                { icon: 'identity', label: 'Photograph', value: answers.photoAssetId ? 'Attached' : 'Not attached' },
              ]}
            />

            <ConsentBlock
              answers={answers}
              set={set}
              fictionTitle="I understand this is a work of fiction"
              fictionBody="This reading is imaginative, astrology-inspired entertainment. It does not prove reincarnation, report verified history, diagnose anything, or explain any real event in your life."
            />
          </>
        ),
      },
    ],
    [signs, past, catalog]
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
      toast(error.message || 'The reading could not be started. Please try again.', { tone: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <WizardShell
      timeline="past"
      title="Begin a reading — Time Machine"
      description="Answer a few questions and the chart will set down a life for you."
      wizard={wizard}
      submitting={submitting}
      submitLabel="Open the chamber"
      onSubmit={submit}
      footnote="Readings are kept for 30 days and can be deleted at any time, along with every asset made for them."
    />
  );
}
