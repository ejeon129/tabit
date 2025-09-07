import { ReactNode } from 'react';

export function Card({ className='', children }) {
  return (
    <div className={`rounded-[var(--radius-card)] bg-panel border border-border/70 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </div>
  );
}
export function CardHeader({ title, subtitle }) {
  return (
    <div className="p-6 border-b border-border/60">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
export function CardBody({ className='', children }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
