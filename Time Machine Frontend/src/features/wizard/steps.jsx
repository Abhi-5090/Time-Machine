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
      toast('We cannot read that kind of file. Use a JPG, PNG or WebP picture.', { tone: 'error' });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast('That picture is bigger than 5 MB. Try a smaller one.', { tone: 'error' });
      return;
    }
    if (!answers.photoConsent) {
      toast('Tick the box above before you add a photo.', { tone: 'error' });
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
      toast('Got your photo. We only use it to draw your picture.', { tone: 'success' });
    } catch (error) {
      toast(error.message || 'That did not upload. Please try again.', { tone: 'error' });
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
    toast('Photo deleted.', { tone: 'info' });
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
        title="Yes, use my photo to draw my picture"
      >
        Your photo goes to the drawing tool so the face looks like yours. We keep it private, and we
        delete it when you delete your card. We never train on it, never show it to anyone else, and
        you never have to give one.
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
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Photo added</p>
                  <p
                    style={{
                      color: 'var(--ink-muted)',
                      fontSize: '0.84rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {answers.photoName || 'Your photo'}
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
                  {uploading ? 'Uploading…' : 'Drop a photo here, or pick a file'}
                </p>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
                  JPG, PNG or WebP · up to 5 MB · a clear photo of your face works best
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
              'You can skip this. Without a photo we do not make a picture, so your card shows a drawn stand-in instead. Everything else on it is the same.'}
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
        title="Yes, use my answers to make my card"
      >
        Your answers go to the tool that writes your card, and they are saved against that card only.
        There is no account, nothing is sold or shared, and deleting the card deletes everything made
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
        Your card deletes itself after 30 days.
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
