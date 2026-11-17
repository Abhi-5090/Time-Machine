import React, { useId } from 'react';
import { cn } from '../../lib/cn';

/**
 * A labelled form control.
 *
 * Wires the label, hint and error message to the input with the right aria
 * attributes so the error is announced rather than only coloured — the kind of
 * detail nobody notices and everybody depends on.
 */
export function Field({ label, hint, error, children, required = false, className }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: children.props.id || id,
        'aria-describedby':
          [children.props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : children.props['aria-invalid'],
        required: required || children.props.required,
      })
    : children;

  return (
    <div className={cn('field', className)}>
      {label ? (
        <label className="field-label" htmlFor={control?.props?.id || id}>
          {label}
          {required ? (
            <span aria-hidden="true" style={{ color: 'var(--accent)' }}>
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {control}

      {hint && !error ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...rest }) {
  return <input className={cn('input', className)} {...rest} />;
}

export function Select({ className, children, ...rest }) {
  return (
    <select className={cn('input', className)} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ className, rows = 4, ...rest }) {
  return <textarea className={cn('input', className)} rows={rows} style={{ resize: 'vertical' }} {...rest} />;
}
