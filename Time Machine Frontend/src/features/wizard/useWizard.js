import { useCallback, useMemo, useState } from 'react';

/**
 * Step machine for both wizards.
 *
 * Holds the answers, the cursor, and the direction of the last move (the shell
 * needs direction so a step entering from a Back press slides the opposite way
 * — motion that contradicts the navigation is worse than no motion at all).
 *
 * Validation is per step and returns a message rather than a boolean, so the
 * reason a step is blocked can be shown next to the control that caused it.
 */
export function useWizard({ steps, initialAnswers }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState(initialAnswers);
  const [showErrors, setShowErrors] = useState(false);
  const [furthest, setFurthest] = useState(0);

  const set = useCallback((patch) => {
    setAnswers((current) =>
      typeof patch === 'function' ? patch(current) : { ...current, ...patch }
    );
  }, []);

  const setPreference = useCallback((key, value) => {
    setAnswers((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
  }, []);

  const step = steps[index];
  const error = useMemo(() => step?.validate?.(answers) || null, [step, answers]);
  const canAdvance = !error;

  const next = useCallback(() => {
    if (error) {
      setShowErrors(true);
      return false;
    }
    setShowErrors(false);
    setDirection(1);
    setIndex((current) => {
      const target = Math.min(current + 1, steps.length - 1);
      setFurthest((high) => Math.max(high, target));
      return target;
    });
    return true;
  }, [error, steps.length]);

  /**
   * Validates the final step before handing off.
   *
   * The last step has no Continue button, so without this the blocking message
   * would never be revealed and pressing submit on an incomplete step would
   * look like nothing happened.
   */
  const trySubmit = useCallback(
    (onSubmit) => {
      if (error) {
        setShowErrors(true);
        return false;
      }
      setShowErrors(false);
      onSubmit();
      return true;
    },
    [error]
  );

  const back = useCallback(() => {
    setShowErrors(false);
    setDirection(-1);
    setIndex((current) => Math.max(0, current - 1));
  }, []);

  /** Jumping is only allowed to steps already completed — never forward past a block. */
  const goTo = useCallback(
    (target) => {
      if (target > furthest) return;
      setShowErrors(false);
      setDirection(target > index ? 1 : -1);
      setIndex(target);
    },
    [furthest, index]
  );

  return {
    index,
    direction,
    step,
    steps,
    answers,
    set,
    setPreference,
    error: showErrors ? error : null,
    liveError: error,
    canAdvance,
    isFirst: index === 0,
    isLast: index === steps.length - 1,
    furthest,
    next,
    back,
    goTo,
    trySubmit,
    progress: ((index + 1) / steps.length) * 100,
  };
}
