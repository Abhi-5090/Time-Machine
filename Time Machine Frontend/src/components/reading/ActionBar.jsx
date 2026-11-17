import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { useToast } from '../ui/Toast';
import { api } from '../../lib/api';
import { forgetReading } from '../../lib/archive';
import { downloadPortrait, exportNodeAsImage, exportNodeAsPdf } from '../../lib/export';
import { Icon } from '../ui/Icon';

/**
 * Everything a reader can do with a finished reading.
 *
 * Each action manages its own pending state so one slow export does not disable
 * the others, and deletion goes through a confirmation that names exactly what
 * is about to be destroyed.
 */
export function ActionBar({ reading, exportRef, title }) {
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
              ? 'My 2050, written out in full.'
              : 'A life I might have lived, written out in full.',
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
      toast('Deleted. Every asset made for this reading is gone.', { tone: 'success' });
      navigate('/archive', { replace: true });
    } catch (error) {
      toast(error.message || 'That could not be deleted.', { tone: 'error' });
      setPending(null);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <Button variant="primary" size="sm" onClick={share} loading={pending === 'share'} icon={<Icon name="share" size={14} />}>
          Share
        </Button>

        {reading.portraitUrl ? (
          <Button
            variant="secondary"
            size="sm"
            loading={pending === 'portrait'}
            icon={<Icon name="png" size={14} />}
            onClick={() =>
              run('portrait', () => downloadPortrait(reading.portraitUrl, title), 'Portrait saved.')
            }
          >
            Portrait
          </Button>
        ) : null}

        <Button
          variant="secondary"
          size="sm"
          loading={pending === 'png'}
          icon={<Icon name="download" size={14} />}
          onClick={() => run('png', () => exportNodeAsImage(exportRef.current, title), 'Image saved.')}
        >
          PNG
        </Button>

        <Button
          variant="secondary"
          size="sm"
          loading={pending === 'pdf'}
          icon={<Icon name="pdf" size={14} />}
          onClick={() => run('pdf', () => exportNodeAsPdf(exportRef.current, title), 'PDF saved.')}
        >
          PDF
        </Button>

        {reading.isOwner ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              loading={pending === 'retry'}
              icon={<Icon name="retry" size={14} />}
              onClick={() =>
                run('retry', () => api.retryReading(reading.readingId), 'Re-rendering the portrait.')
              }
            >
              Redo portrait
            </Button>

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
        title="Delete this reading?"
        description="This removes the chronicle, the portrait, any photograph you shared, and the stored profile. It cannot be undone."
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
          If you want to keep a copy, export it as a PDF or save the portrait first — the link will
          stop working for everyone the moment this is deleted.
        </p>
      </Dialog>
    </>
  );
}
