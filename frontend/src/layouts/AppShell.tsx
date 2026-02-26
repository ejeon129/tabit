export default function AppShell({ children }) {
  return (
    <div className="min-h-dvh app-bg">
      <header className="sticky top-0 z-40 border-b border-border/90 bg-panel/80 backdrop-blur-lg">
        <div className="mx-auto max-w-screen-lg px-4 py-3 flex items-center gap-3">
          <img src="/favicon.svg" alt="Tabit logo" className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight text-brand-500">Tabit</span>
          <span className="ml-auto text-xs font-medium text-muted">Audio to Guitar Tabs</span>
        </div>
      </header>

      <main className="mx-auto max-w-screen-lg px-4 py-8">
        {children}
      </main>

      <footer className="mx-auto max-w-screen-lg px-4 py-10 text-xs text-muted">
        Tabit v0.3 • Built for quick, practical guitar transcription
      </footer>
    </div>
  );
}
