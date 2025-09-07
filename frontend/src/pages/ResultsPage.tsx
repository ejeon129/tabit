import { useLocation, Link } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const tabOutput = location.state?.tabOutput || '';

  return (
    <div className="mx-auto max-w-screen-md p-6">
      <h2 className="text-2xl font-semibold">Generated Tabs</h2>

      {!tabOutput ? (
        <div className="mt-4 rounded-lg border border-slate-700 p-4">
          <p className="text-slate-300">No tabs to display. Please upload a file first.</p>
          <Link to="/" className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
            Go to Upload
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <pre className="overflow-auto rounded-xl bg-[#0B1020] p-4 text-sm leading-relaxed whitespace-pre text-slate-200">
{tabOutput}
          </pre>

          <div className="mt-4 flex gap-3">
            <button
              onClick={async () => { try { await navigator.clipboard.writeText(tabOutput); } catch {} }}
              className="rounded-lg border border-slate-700 px-3 py-2 hover:border-slate-500"
            >
              Copy
            </button>
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(tabOutput)}`}
              download={`tabit_${Date.now()}.txt`}
              className="rounded-lg border border-slate-700 px-3 py-2 hover:border-slate-500"
            >
              Download TXT
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
