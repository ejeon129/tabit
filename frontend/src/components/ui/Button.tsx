// src/components/ui/Button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;            // <-- optional
};

export function Button({
  variant = 'primary',
  loading = false,              // <-- default so callers can omit it
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ' +
    'outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600';

  const style =
    variant === 'primary'
      ? 'bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-60'
      : variant === 'danger'
      ? 'bg-danger-500/90 hover:bg-danger-500 text-white disabled:opacity-60'
      : 'bg-transparent border border-border text-[--color-text] hover:border-white/40';

  return (
    <button
      className={`${base} ${style} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin border-2 border-white/40 border-t-white rounded-full" />
      )}
      {children}
    </button>
  );
}
