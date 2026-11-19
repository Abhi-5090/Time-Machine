import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';
import { cardUrl, renderQrCode, downloadQrCode } from '../../lib/export';
import { EASE_OUT, DURATION } from '../../motion/easings';

/**
 * The QR code beside the card.
 *
 * At a stall the card is on someone else's screen — a laptop on a table, a
 * monitor on a stand — and the thing people actually want is it on their own
 * phone. Typing a URL with a uuid in it is not going to happen. A code they
 * point a camera at is.
 *
 * It encodes the card's plain address. Opening that on a phone with no owner
 * token shows the finished card and every way of saving it, while delete and
 * redo stay behind the token and so never leave the machine that made it.
 * That split is deliberate: a code held up in a crowd must not carry anything
 * destructive.
 *
 * The code is generated in the browser. Nothing about the reading is sent to
 * a QR service, which would mean handing a third party the address of a card
 * that has somebody's face on it.
 */
export function ShareQr({ readingId, name }) {
  const toast = useToast();
  const [qr, setQr] = useState({ status: 'loading', dataUrl: null });

  const url = useMemo(() => cardUrl(readingId), [readingId]);

  useEffect(() => {
    let cancelled = false;
    setQr({ status: 'loading', dataUrl: null });

    renderQrCode(url)
      .then((dataUrl) => {
        if (!cancelled) setQr({ status: 'ready', dataUrl });
      })
      .catch(() => {
        if (!cancelled) setQr({ status: 'error', dataUrl: null });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const save = () => {
    try {
      downloadQrCode(qr.dataUrl, name);
      toast('QR code saved to your downloads.', { tone: 'success' });
    } catch (error) {
      toast(error.message || 'The QR code could not be saved.', { tone: 'error' });
    }
  };

  return (
    <motion.aside
      className="share-qr"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.15 }}
    >
      {/* A camera, not an eye: the instruction is to point a phone at this. */}
      <p className="share-qr__eyebrow">
        <Icon name="capture" size={13} />
        Scan for your card
      </p>

      <div className="share-qr__tile" data-status={qr.status}>
        {qr.status === 'ready' ? (
          <img
            src={qr.dataUrl}
            alt={`QR code that opens ${name}'s card`}
            className="share-qr__code"
            width={180}
            height={180}
          />
        ) : qr.status === 'error' ? (
          <p className="share-qr__fallback">
            The code could not be made. Use Share above to send yourself the link.
          </p>
        ) : (
          <span className="share-qr__fallback">Making your code…</span>
        )}
      </div>

      <p className="share-qr__hint">
        Point your phone&rsquo;s camera at this. Your card opens there, and you can save it
        straight to your phone.
      </p>

      <Button
        variant="secondary"
        size="sm"
        block
        onClick={save}
        disabled={qr.status !== 'ready'}
        icon={<Icon name="download" size={14} />}
      >
        Save QR code
      </Button>
    </motion.aside>
  );
}
