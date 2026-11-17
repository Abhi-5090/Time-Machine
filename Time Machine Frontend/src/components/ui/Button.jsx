import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { LottieIcon } from '../../lottie/LottieIcon';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const SIZES = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

/**
 * The one pressable element in the app.
 *
 * Press feedback (`scale(0.97)` on `:active`) and the themed shape live in
 * components.css, so a `<Link className="btn btn-primary">` elsewhere behaves
 * identically — this component exists for ergonomics and the loading state,
 * not to own the styling.
 *
 * While loading, the label is kept in the DOM at zero opacity so the button
 * does not change width mid-action.
 */
export const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon = null,
    iconAfter = null,
    block = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      className={cn('btn', VARIANTS[variant], SIZES[size], block && 'btn-block', className)}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component === 'button' ? undefined : isDisabled || undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span style={{ position: 'absolute', display: 'inline-flex' }}>
          <LottieIcon name="loader" size={30} primary="currentColor" secondary="currentColor" />
        </span>
      ) : null}

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          opacity: loading ? 0 : 1,
          // Blur bridges the swap so the label and the spinner do not read as
          // two separate objects crossing over each other.
          filter: loading ? 'blur(3px)' : 'none',
          transition: 'opacity var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
        }}
      >
        {icon}
        {children}
        {iconAfter}
      </span>
    </Component>
  );
});
