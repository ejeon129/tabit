export default function AppShell({ children }) {
  return (
    <div className="min-h-dvh app-bg">
      <header className="sticky top-0 z-40 backdrop-blur bg-panel/70 border-b border-border">
        <div className="mx-auto max-w-screen-lg px-4 py-3 flex items-center gap-3">
          {/* Logo mark */}
          <img src="/favicon.svg" alt="Tabit logo" className="h-7 w-7" />

          {/* Brand text */}
          <span className="text-lg font-bold tracking-tight text-brand-500">Tabit</span>

          <span className="ml-auto text-xs text-muted">Audio → Tablature</span>
        </div>
      </header>

      <main className="mx-auto max-w-screen-lg px-4 py-8">
        {children}
      </main>

      <footer className="mx-auto max-w-screen-lg px-4 py-10 text-xs text-muted">
        Built with ❤️ for guitarists • Tabit v0.2
      </footer>
    </div>
  );
}
