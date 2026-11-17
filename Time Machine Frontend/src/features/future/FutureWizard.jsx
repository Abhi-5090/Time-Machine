import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WizardShell } from '../wizard/WizardShell';
import { useWizard } from '../wizard/useWizard';
import { PhotoStep, ConsentBlock, ReviewList } from '../wizard/steps';
import { StarsPick } from '../wizard/StarsPick';
import { Field, Input, Select } from '../../components/ui/Field';
import { useCatalog, FALLBACK_SIGNS } from '../../lib/useCatalog';
import { textGlyph } from '../../lib/glyph';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../lib/api';
import { rememberReading } from '../../lib/archive';
import { EASE_OUT, DURATION } from '../../motion/easings';
import '../wizard/wizard.css';
import './future.css';

const TARGET_YEAR = 2050;

/*
 * Same two steps as the past wizard. The sector, the outlook, the archetype,
 * the habitat and the capture style are all settled from the birth details
 * now; what the reader still supplies is what only they can know.
 *
 * The date of birth is the one hard requirement here, because it is what sets
 * how old the portrait has to look in 2050.
 */
const INITIAL = {
  preferredName: '',
  dateOfBirth: '',
  selectedZodiacSign: '',
  birthplace: '',
  birthTime: '',
  photoConsent: false,
  photoAssetId: null,
  photoPreview: null,
  photoName: null,
  consentFiction: false,
  consentReading: false,
  preferences: {
    futureArchetypeId: 'auto',
    futureSector: 'system_select',
    futureHabitat: 'system_select',
    futureOutlook: 'luminous',
    futureAesthetic: 'holographic_realism',
    portraitFraming: 'close_up',
  },
};

function projectedAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const date = new Date(dateOfBirth);
  if (Number.isNaN(date.getTime())) return null;
  const age = TARGET_YEAR - date.getUTCFullYear();
  return age >= 5 && age <= 120 ? age : null;
}

export default function FutureWizard() {
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
          'Five quick things. We need your birth day most of all — it tells us how old you will be in 2050.',
        validate: (answers) =>
          answers.dateOfBirth ? null : 'We need your date of birth to work out your age in 2050.',
        render: ({ answers, set }) => {
          const age = projectedAge(answers.dateOfBirth);

          return (
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

              <Field label="Date of birth" hint="This tells us your age in 2050." required>
                <Input
                  type="date"
                  value={answers.dateOfBirth}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => set({ dateOfBirth: event.target.value })}
                />
              </Field>

              {age ? (
                <motion.div
                  className="panel hud-frame"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  <p className="readout" style={{ marginBottom: 'var(--space-2)' }}>
                    Age locked in
                  </p>
                  <p style={{ fontSize: '1.05rem' }}>
                    In 2050 you will be{' '}
                    <strong style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{age}</strong>.
                    Your picture will show you at {age}, not as you look today.
                  </p>
                </motion.div>
              ) : null}

              <Field
                label="Your star sign"
                hint="You can leave this. We will work it out from your birth day."
              >
                <Select
                  value={answers.selectedZodiacSign}
                  onChange={(event) => set({ selectedZodiacSign: event.target.value })}
                >
                  <option value="">Work it out from my birth day</option>
                  {signs.map((sign) => (
                    <option key={sign.name} value={sign.name}>
                      {textGlyph(sign.symbol)} {sign.name}
                    </option>
                  ))}
                </Select>
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
          );
        },
      },

      {
        id: 'photo',
        label: 'Your photo',
        title: 'Add your photo',
        description:
          'Your photo lets us show you at your 2050 age, with your own face. You can skip it and still get your card.',
        validate: (answers) =>
          !answers.consentFiction || !answers.consentReading
            ? 'Please tick both boxes before we start.'
            : null,
        render: ({ answers, set }) => {
          const age = projectedAge(answers.dateOfBirth);

          return (
            <>
              <PhotoStep
                answers={answers}
                set={set}
                copy={{
                  skipNote: age
                    ? `No photo is fine. We will draw a ${age}-year-old face for you instead, and your card will look just as good.`
                    : 'No photo is fine. We will draw a face for you instead, and your card will look just as good.',
                }}
              />

              <StarsPick
                items={[
                  'The job you do in 2050',
                  'The city you live in',
                  'The tools you work with',
                  'How your picture is taken',
                ]}
              />

              <ReviewList
                rows={[
                  { icon: 'signature', label: 'Name', value: answers.preferredName || 'We will name you' },
                  { icon: 'calendar', label: 'Born on', value: answers.dateOfBirth },
                  { icon: 'gauge', label: 'Your age in 2050', value: age ? `${age}` : '—' },
                  { icon: 'star', label: 'Star sign', value: answers.selectedZodiacSign || 'From your birth day' },
                  { icon: 'chamber', label: 'Born at', value: answers.birthTime || 'Not given' },
                  { icon: 'place', label: 'Born in', value: answers.birthplace || 'Not given' },
                  { icon: 'identity', label: 'Photo', value: answers.photoAssetId ? 'Added' : 'Not added' },
                ]}
              />

              <ConsentBlock
                answers={answers}
                set={set}
                fictionTitle="I know this is a story, not a real forecast"
                fictionBody="This is a made-up story about 2050. It says nothing real about your health, how long you will live, your money, your job or the people in your life, and it is not advice."
              />
            </>
          );
        },
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
        timeline: 'future',
        profile: {
          preferredName: answers.preferredName || '',
          dateOfBirth: answers.dateOfBirth || null,
          // Omitted entirely when left on automatic: the server derives it.
          ...(answers.selectedZodiacSign ? { selectedZodiacSign: answers.selectedZodiacSign } : {}),
          zodiacInputMode: answers.selectedZodiacSign ? 'manual_symbolic_choice' : 'derived_from_date',
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
        timeline: 'future',
        status: 'processing',
        name: answers.preferredName || 'Unnamed',
        sector: answers.preferences.futureSector,
      });

      navigate(`/reading/${readingId}/reveal`);
    } catch (error) {
      toast(error.message || 'We could not start your reading. Please try again.', { tone: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <WizardShell
      timeline="future"
      title="See your 2050 — Time Machine"
      description="Answer a few things and we will show you the year 2050 with you in it."
      wizard={wizard}
      submitting={submitting}
      submitLabel="Show me 2050"
      onSubmit={submit}
      footnote="We keep your reading for 30 days. You can delete it any time, and everything made for it goes with it."
    />
  );
}
