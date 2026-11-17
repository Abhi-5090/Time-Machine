import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from './Icon';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * A modal dialog.
 *
 * Handles the things that are invisible when they work and glaring when they
 * do not: Escape closes, focus moves in on open and returns to the trigger on
 * close, Tab cycles inside the panel, and the page behind does not scroll.
 *
 * The panel scales from its centre rather than from a trigger — a modal is not
 * anchored to anything, so centre-origin is correct here even though it is
 * wrong for a popover.
 */
export function Dialog({ open, onClose, title, description, children, footer, labelledBy }) {
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
        (node) => node.offsetParent !== null
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      const target = panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
      target?.focus();
    }, 20);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = overflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labelledBy ? undefined : title}
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className="dialog-panel"
            // Never from scale(0): it would appear out of nothing.
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                padding: 'var(--space-5) var(--space-5) var(--space-4)',
              }}
            >
              <div style={{ flex: 1 }}>
                {title ? <h3 style={{ fontSize: '1.4rem' }}>{title}</h3> : null}
                {description ? (
                  <p style={{ marginTop: 'var(--space-2)', color: 'var(--ink-muted)', fontSize: '0.92rem' }}>
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="btn btn-ghost btn-sm"
                style={{ padding: 6, marginTop: -4 }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div style={{ padding: '0 var(--space-5) var(--space-5)' }}>{children}</div>

            {footer ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4) var(--space-5)',
                  borderTop: '1px solid var(--rule)',
                }}
              >
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
