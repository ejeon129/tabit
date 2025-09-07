import { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-border/80">
        <div className="mx-auto max-w-screen-lg px-4 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-600" />
          <span className="text-lg font-semibold tracking-tight">Tabit</span>
          <span className="ml-auto text-sm text-muted">Audio → Tablature</span>
        </div>
      </header>

      <main className="mx-auto max-w-screen-lg px-4 py-8">
        {children}
      </main>

      <footer className="mx-auto max-w-screen-lg px-4 py-10 text-sm text-muted">
        Built with ❤️ for guitarists • v0.2
      </footer>
    </div>
  );
}
