import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT, DURATION } from '../../motion/easings';
import { Icon } from './Icon';

const ToastContext = createContext(() => {});

/** Tone → icon name and colour, so a toast reads correctly before it is read. */
const TONES = {
  success: { icon: 'success', color: 'var(--color-positive)' },
  error: { icon: 'error', color: 'var(--color-danger)' },
  info: { icon: 'info', color: 'var(--accent)' },
};

const DEFAULT_DURATION = 4200;

/**
 * Toasts.
 *
 * Two details that are easy to skip and obvious in use:
 *   · timers pause while the tab is hidden, so a message sent as the user
 *     switches away is still there when they come back;
 *   · enter and exit both translate on the Y axis in the same direction, which
 *     is what makes the dismissal read as the toast leaving rather than
 *     vanishing.
 *
 * Exit is faster than enter — the system responding should feel quicker than
 * the user deciding.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const remaining = useRef(new Map());
  const startedAt = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    remaining.current.delete(id);
    startedAt.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const schedule = useCallback(
    (id, delay) => {
      startedAt.current.set(id, Date.now());
      remaining.current.set(id, delay);
      timers.current.set(id, setTimeout(() => dismiss(id), delay));
    },
    [dismiss]
  );

  const toast = useCallback(
    (message, { tone = 'info', duration = DEFAULT_DURATION } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      schedule(id, duration);
      return id;
    },
    [schedule]
  );

  // Hold every timer while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        for (const [id, timer] of timers.current) {
          clearTimeout(timer);
          const elapsed = Date.now() - (startedAt.current.get(id) || Date.now());
          remaining.current.set(id, Math.max(800, (remaining.current.get(id) || DEFAULT_DURATION) - elapsed));
        }
      } else {
        for (const id of [...remaining.current.keys()]) {
          schedule(id, remaining.current.get(id) || DEFAULT_DURATION);
        }
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [schedule]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="toast-viewport" role="region" aria-label="Notifications">
              <AnimatePresence initial={false}>
                {toasts.map((item) => {
                  const tone = TONES[item.tone] || TONES.info;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className="toast"
                      data-tone={item.tone}
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: DURATION.fast } }}
                      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
                      onClick={() => dismiss(item.id)}
                    >
                      <Icon
                        name={tone.icon}
                        size={16}
                        style={{ marginTop: 3, color: tone.color }}
                      />
                      <span>{item.message}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
