import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WizardShell } from '../wizard/WizardShell';
import { useWizard } from '../wizard/useWizard';
import { PhotoStep, ConsentBlock, ReviewList } from '../wizard/steps';
import { Field, Input, Select } from '../../components/ui/Field';
import { ChoiceGrid } from '../../components/ui/Choice';
import { useCatalog, FALLBACK_SIGNS } from '../../lib/useCatalog';
import { textGlyph } from '../../lib/glyph';
import { withIcons } from '../../lib/iconMap';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../lib/api';
import { rememberReading } from '../../lib/archive';
import { EASE_OUT, DURATION } from '../../motion/easings';
import '../wizard/wizard.css';
import './future.css';

const TARGET_YEAR = 2050;

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

const labelFor = (options, id, key = 'label') =>
  options?.find((option) => option.id === id)?.[key] ?? id;

export default function FutureWizard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { catalog } = useCatalog();
  const [submitting, setSubmitting] = useState(false);

  const future = catalog?.future;
  const signs = catalog?.zodiacSigns?.length ? catalog.zodiacSigns : FALLBACK_SIGNS;

  const steps = useMemo(
    () => [
      {
        id: 'subject',
        label: 'Subject',
        title: 'Who are we projecting?',
        description:
          'The projection needs a name to address and a birth year to place you at the right point in 2050.',
        validate: (answers) =>
          answers.dateOfBirth ? null : 'A date of birth is needed to position you in 2050.',
        render: ({ answers, set }) => {
          const age = projectedAge(answers.dateOfBirth);

          return (
            <>
              <Field
                label="Preferred name"
                hint="Used throughout the chronicle. Leave it blank and the projection assigns a call-sign."
              >
                <Input
                  value={answers.preferredName}
                  onChange={(event) => set({ preferredName: event.target.value })}
                  placeholder="What should 2050 call you?"
                  maxLength={60}
                  autoComplete="given-name"
                />
              </Field>

              <Field
                label="Date of birth"
                hint="Only the year is used, and only to work out how old you are when the chronicle opens."
                required
              >
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
                    Reference frame locked
                  </p>
                  <p style={{ fontSize: '1.05rem' }}>
                    In 2050 you are{' '}
                    <strong style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{age}</strong>.
                    The chronicle will be written for that life stage.
                  </p>
                </motion.div>
              ) : null}

              <Field
                label="Star sign"
                hint="Optional. 2050 uses it only as a recurring motif — leave it on automatic and it is derived from your date."
              >
                <Select
                  value={answers.selectedZodiacSign}
                  onChange={(event) => set({ selectedZodiacSign: event.target.value })}
                >
                  <option value="">Derive from my date of birth</option>
                  {signs.map((sign) => (
                    <option key={sign.name} value={sign.name}>
                      {textGlyph(sign.symbol)} {sign.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          );
        },
      },

      {
        id: 'field',
        label: 'Field',
        title: 'What is the work?',
        description:
          'The sector sets what 2050 looks like from where you stand. The outlook sets how honest it is about the cost.',
        validate: () => null,
        render: ({ answers, setPreference }) => (
          <>
            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Sector
              </p>
              <ChoiceGrid
                aria-label="Sector"
                options={withIcons(future?.sectors, 'sector')}
                value={answers.preferences.futureSector}
                onChange={(id) => setPreference('futureSector', id)}
                columns={215}
              />
            </div>

            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Outlook
              </p>
              <ChoiceGrid
                aria-label="Outlook"
                options={withIcons(future?.outlooks, 'outlook', (item) => ({
                  id: item.id,
                  label: item.label,
                  note: item.note,
                }))}
                value={answers.preferences.futureOutlook}
                onChange={(id) => setPreference('futureOutlook', id)}
                columns={215}
              />
            </div>
          </>
        ),
      },

      {
        id: 'persona',
        label: 'Persona',
        title: 'Who have you become?',
        description:
          'Pick the figure you want to be resolved as, or leave it on automatic and let the sector decide.',
        validate: () => null,
        render: ({ answers, setPreference }) => (
          <>
            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                2050 archetype
              </p>
              <ChoiceGrid
                aria-label="2050 archetype"
                options={withIcons(future?.archetypes, 'futureArchetype', (item) => ({
                  id: item.id,
                  label: item.displayName,
                  note: item.shortDescription,
                }))}
                value={answers.preferences.futureArchetypeId}
                onChange={(id) => setPreference('futureArchetypeId', id)}
                columns={240}
              />
            </div>

            <div>
              <p className="field-label" style={{ marginBottom: 'var(--space-3)' }}>
                Habitat
              </p>
              <ChoiceGrid
                aria-label="Habitat"
                options={withIcons(future?.habitats, 'habitat', (item) => ({
                  id: item.id,
                  label: item.label,
                  note: item.tagline,
                }))}
                value={answers.preferences.futureHabitat}
                onChange={(id) => setPreference('futureHabitat', id)}
                columns={240}
              />
            </div>
          </>
        ),
      },

      {
        id: 'capture',
        label: 'Capture',
        title: 'How should the capture look?',
        description:
          'The portrait is shot as if someone photographed you at work in 2050. Sharing a photograph is optional.',
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
                  Aesthetic
                </p>
                <ChoiceGrid
                  aria-label="Aesthetic"
                  options={withIcons(future?.aesthetics, 'aesthetic')}
                  value={answers.preferences.futureAesthetic}
                  onChange={(id) => setPreference('futureAesthetic', id)}
                  columns={210}
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

            <PhotoStep
              answers={answers}
              set={set}
              copy={{
                skipNote:
                  'No photograph is fine. The capture resolves a face from the persona instead, and the result is just as complete.',
              }}
            />
          </>
        ),
      },

      {
        id: 'review',
        label: 'Review',
        title: 'Confirm the projection',
        description: 'Check the inputs before the frame is locked.',
        validate: (answers) =>
          !answers.consentFiction || !answers.consentReading
            ? 'Both acknowledgements are required before a projection can run.'
            : null,
        render: ({ answers, set }) => (
          <>
            <ReviewList
              rows={[
                { icon: 'signature', label: 'Name', value: answers.preferredName || 'Call-sign assigned' },
                { icon: 'calendar', label: 'Born', value: answers.dateOfBirth },
                {
                  icon: 'gauge',
                  label: 'Age in 2050',
                  value: projectedAge(answers.dateOfBirth) ? `${projectedAge(answers.dateOfBirth)}` : '—',
                },
                { icon: 'star', label: 'Sign motif', value: answers.selectedZodiacSign || 'Derived from date' },
                { icon: 'target', label: 'Sector', value: labelFor(future?.sectors, answers.preferences.futureSector) },
                { icon: 'scan', label: 'Outlook', value: labelFor(future?.outlooks, answers.preferences.futureOutlook) },
                {
                  icon: 'persona',
                  label: 'Archetype',
                  value: labelFor(
                    (future?.archetypes || []).map((item) => ({ id: item.id, label: item.displayName })),
                    answers.preferences.futureArchetypeId
                  ),
                },
                { icon: 'city', label: 'Habitat', value: labelFor(future?.habitats, answers.preferences.futureHabitat) },
                {
                  icon: 'capture',
                  label: 'Capture',
                  value: `${labelFor(future?.aesthetics, answers.preferences.futureAesthetic)} · ${labelFor(
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
              fictionTitle="I understand this is speculative fiction"
              fictionBody="This projection is a story, not a forecast. It makes no claim about your real future health, lifespan, finances, career or relationships, and it is not advice of any kind."
            />
          </>
        ),
      },
    ],
    [future, catalog, signs]
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
      toast(error.message || 'The projection could not be started. Please try again.', { tone: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <WizardShell
      timeline="future"
      title="Run a projection — 2050"
      description="Answer a few questions and 2050 will be written with you in it."
      wizard={wizard}
      submitting={submitting}
      submitLabel="Lock the frame"
      onSubmit={submit}
      footnote="Projections are kept for 30 days and can be deleted at any time, along with every asset made for them."
    />
  );
}
