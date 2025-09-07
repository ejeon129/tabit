type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
};

export function Button({ variant='primary', loading, className='', children, ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition outline-offset-2 focus:outline focus:outline-2 focus:outline-brand-600';
  const styles =
    variant === 'primary'
      ? 'bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-60'
      : variant === 'danger'
        ? 'bg-danger-500/90 hover:bg-danger-500 text-white disabled:opacity-60'
        : 'bg-transparent border border-border text-[--color-text] hover:border-white/40';
  return (
    <button className={`${base} ${styles} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading && <span className="mr-2 h-4 w-4 animate-spin border-2 border-white/40 border-t-white rounded-full" />}
      {children}
    </button>
  );
}
