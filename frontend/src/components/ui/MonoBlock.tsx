export function MonoBlock({ text }: { text: string }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };
  return (
    <div className="relative group">
      <pre className="overflow-auto rounded-xl bg-[#0B1020] p-4 text-sm leading-relaxed whitespace-pre text-slate-200">
{ text || '/* Tabs will appear here */' }
      </pre>
      <button
        onClick={copy}
        className="absolute right-3 top-3 text-xs rounded-lg border border-border px-2 py-1 hover:border-white/40 opacity-0 group-hover:opacity-100 transition"
        aria-label="Copy tabs to clipboard"
      >
        Copy
      </button>
    </div>
  );
}
