export function MonoBlock({ text }) {
  const copy = async () => { try { await navigator.clipboard.writeText(text); } catch {} };
  return (
    <div className="relative group">
      <pre className="overflow-auto rounded-xl border border-border bg-[#0f172a] p-4 font-mono text-sm leading-relaxed whitespace-pre text-slate-100 shadow-inner">
{ text || '/* Tabs will appear here */' }
      </pre>
      <button
        onClick={copy}
        className="absolute right-3 top-3 rounded-lg border border-border bg-white px-2 py-1 text-xs text-slate-700 opacity-0 transition group-hover:opacity-100 hover:bg-slate-50"
        aria-label="Copy tabs"
      >
        Copy
      </button>
    </div>
  );
}
