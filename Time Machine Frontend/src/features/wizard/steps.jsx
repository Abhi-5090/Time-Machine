import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '../../components/ui/Choice';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from '../../components/ui/Icon';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Optional reference photograph.
 *
 * Two rules are enforced here rather than left to the server:
 *   · the file is not uploaded until the consent box is ticked — consent before
 *     transmission, not after;
 *   · removing the photo deletes the stored asset as well as the local preview,
 *     so "remove" means removed rather than hidden.
 */
export function PhotoStep({ answers, set, copy }) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast('That file type is not supported. Use a JPEG, PNG or WebP image.', { tone: 'error' });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast('That image is larger than 5 MB. Try a smaller one.', { tone: 'error' });
      return;
    }
    if (!answers.photoConsent) {
      toast('Tick the photo consent box before uploading.', { tone: 'error' });
      return;
    }

    setUploading(true);
    try {
      const response = await api.uploadReferencePhoto(file, true);
      set({
        photoAssetId: response.data.assetId,
        photoPreview: URL.createObjectURL(file),
        photoName: file.name,
      });
      toast('Photograph received. It is used only to style your portrait.', { tone: 'success' });
    } catch (error) {
      toast(error.message || 'That upload did not go through.', { tone: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    const assetId = answers.photoAssetId;
    if (answers.photoPreview) URL.revokeObjectURL(answers.photoPreview);
    set({ photoAssetId: null, photoPreview: null, photoName: null });
    if (assetId) {
      await api.deleteReferencePhoto(assetId).catch(() => {});
    }
    toast('Photograph deleted.', { tone: 'info' });
  };

  return (
    <>
      <Checkbox
        id="photo-consent"
        checked={answers.photoConsent}
        onChange={(checked) => {
          if (!checked && answers.photoAssetId) removePhoto();
          set({ photoConsent: checked });
        }}
        title="I consent to my photograph being used for this portrait"
      >
        Your image is sent to the portrait model to preserve your likeness, stored privately, and
        deleted when you delete the reading. It is never used for training, never shown to anyone
        else, and never required.
      </Checkbox>

      <AnimatePresence mode="wait" initial={false}>
        {answers.photoConsent ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: DURATION.fast } }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            style={{ overflow: 'hidden' }}
          >
            {answers.photoAssetId ? (
              <div
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}
              >
                {answers.photoPreview ? (
                  <img src={answers.photoPreview} alt="" className="photo-preview" />
                ) : null}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Photograph attached</p>
                  <p
                    style={{
                      color: 'var(--ink-muted)',
                      fontSize: '0.84rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {answers.photoName || 'Reference image'}
                  </p>
                </div>
                <Button variant="danger" size="sm" onClick={removePhoto} icon={<Icon name="delete" size={14} />}>
                  Remove
                </Button>
              </div>
            ) : (
              <div
                className="photo-drop"
                data-dragging={dragging}
                role="button"
                tabIndex={0}
                style={{ marginTop: 'var(--space-4)' }}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  handleFile(event.dataTransfer.files?.[0]);
                }}
              >
                <Icon name="upload" size={24} style={{ color: 'var(--accent)' }} />
                <p style={{ fontWeight: 600 }}>
                  {uploading ? 'Uploading…' : 'Drop a photograph, or choose a file'}
                </p>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
                  JPEG, PNG or WebP · up to 5 MB · a clear, front-facing photo works best
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED.join(',')}
                  className="sr-only"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.p
            key="skip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}
          >
            {copy?.skipNote ||
              'No photograph is fine. A face will be imagined entirely, and the result is just as complete.'}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

/** The two mandatory consents, shared by both timelines. */
export function ConsentBlock({ answers, set, fictionTitle, fictionBody }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Checkbox
        id="consent-fiction"
        checked={answers.consentFiction}
        onChange={(checked) => set({ consentFiction: checked })}
        title={fictionTitle}
      >
        {fictionBody}
      </Checkbox>

      <Checkbox
        id="consent-processing"
        checked={answers.consentReading}
        onChange={(checked) => set({ consentReading: checked })}
        title="I agree to my answers being processed to generate this reading"
      >
        Your answers are sent to the generation service and stored against this reading alone. There
        is no account, nothing is sold or shared, and deleting the reading removes every asset made
        from it.
      </Checkbox>

      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: '0.8rem',
          color: 'var(--ink-muted)',
          marginTop: 'var(--space-2)',
        }}
      >
        <Icon name="shield" size={14} />
        Readings expire automatically after 30 days.
      </p>
    </div>
  );
}

/** A definition list used for the final review step. */
export function ReviewList({ rows }) {
  return (
    <dl className="review-list">
      {rows
        .filter((row) => row.value)
        .map((row) => (
          <div className="review-row" key={row.label}>
            <dt>
              {row.icon ? <Icon name={row.icon} size={12} /> : null}
              {row.label}
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
    </dl>
  );
}
