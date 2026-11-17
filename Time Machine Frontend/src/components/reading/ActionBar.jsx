import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { useToast } from '../ui/Toast';
import { api } from '../../lib/api';
import { forgetReading } from '../../lib/archive';
import { downloadPortrait, exportSheetAsImage, exportSheetAsPdf } from '../../lib/export';
import { Icon } from '../ui/Icon';

/**
 * Everything a reader can do with a finished card.
 *
 * Saving the card as an image is the primary action and sits first, because it
 * is the one thing most people at a stall actually want: the sheet, on their
 * phone, to keep. Each action manages its own pending state so one slow export
 * does not disable the others, and deletion goes through a confirmation that
 * names exactly what is about to be destroyed.
 */
export function ActionBar({ reading, sheetRef, title }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [pending, setPending] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const run = async (key, action, successMessage) => {
    setPending(key);
    try {
      const result = await action();
      if (successMessage) toast(typeof successMessage === 'function' ? successMessage(result) : successMessage, { tone: 'success' });
    } catch (error) {
      toast(error.message || 'That did not work. Please try again.', { tone: 'error' });
    } finally {
      setPending(null);
    }
  };

  const share = () =>
    run(
      'share',
      async () => {
        const { shareLink } = await import('../../lib/export');
        return shareLink(window.location.href, {
          title,
          text:
            reading.timeline === 'future'
              ? 'This is me in 2050.'
              : 'This is the life I might have lived.',
        });
      },
      (result) =>
        result === 'shared' ? 'Shared.' : result === 'cancelled' ? 'Share cancelled.' : 'Link copied to your clipboard.'
    );

  const remove = async () => {
    setConfirmingDelete(false);
    setPending('delete');
    try {
      await api.deleteReading(reading.readingId);
      forgetReading(reading.readingId);
      toast('Deleted. Everything we made for this card is gone.', { tone: 'success' });
      navigate('/archive', { replace: true });
    } catch (error) {
      toast(error.message || 'That could not be deleted.', { tone: 'error' });
      setPending(null);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <Button
          variant="primary"
          size="sm"
          loading={pending === 'png'}
          icon={<Icon name="download" size={14} />}
          onClick={() => run('png', () => exportSheetAsImage(sheetRef.current, title), 'Card saved to your downloads.')}
        >
          Download card
        </Button>

        <Button variant="secondary" size="sm" onClick={share} loading={pending === 'share'} icon={<Icon name="share" size={14} />}>
          Share
        </Button>

        {reading.portraitUrl ? (
          <Button
            variant="secondary"
            size="sm"
            loading={pending === 'portrait'}
            icon={<Icon name="png" size={14} />}
            onClick={() =>
              run('portrait', () => downloadPortrait(reading.portraitUrl, title), 'Picture saved.')
            }
          >
            Just the picture
          </Button>
        ) : null}

        <Button
          variant="secondary"
          size="sm"
          loading={pending === 'pdf'}
          icon={<Icon name="pdf" size={14} />}
          onClick={() => run('pdf', () => exportSheetAsPdf(sheetRef.current, title), 'PDF saved. It is a full A4 page.')}
        >
          PDF
        </Button>

        {reading.isOwner ? (
          <>
            {/* Only offered when there is a picture to make again. Without a
                photo none was ever drawn, so the server refuses the retry and
                a button that always errors is worse than no button. */}
            {reading.portraitUrl ? (
              <Button
                variant="ghost"
                size="sm"
                loading={pending === 'retry'}
                icon={<Icon name="retry" size={14} />}
                onClick={() =>
                  run('retry', () => api.retryReading(reading.readingId), 'Making a new picture for you.')
                }
              >
                Redo the picture
              </Button>
            ) : null}

            <Button
              variant="danger"
              size="sm"
              loading={pending === 'delete'}
              icon={<Icon name="delete" size={14} />}
              onClick={() => setConfirmingDelete(true)}
            >
              Delete
            </Button>
          </>
        ) : null}
      </div>

      <Dialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="Delete this card?"
        description="This deletes your card, the picture, the photo you shared and your details. You cannot get it back."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={remove} icon={<Icon name="delete" size={14} />}>
              Delete permanently
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
          If you want to keep a copy, download the card first. The link will stop working for
          everyone as soon as you delete it.
        </p>
      </Dialog>
    </>
  );
}
