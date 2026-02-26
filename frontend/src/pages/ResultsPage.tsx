import { useLocation, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MonoBlock } from '../components/ui/MonoBlock';

type TabEvent = {
  time_sec: number;
  note: string;
  string: number;
  fret: number;
};

type TranscribeResponse = {
  ascii_tab: string;
  events: TabEvent[];
  metrics: {
    event_count: number;
    duration_sec: number;
    sample_rate_hz: number;
  };
};

export default function ResultsPage() {
  const { state } = useLocation() as { state?: { result?: TranscribeResponse; sourceName?: string } };
  const result = state?.result;
  const tabOutput = result?.ascii_tab ?? '';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader title="Generated tabs" subtitle="Copy or export below" />
        <CardBody>
          {result && (
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border px-2 py-1 text-muted">
                Notes: {result.metrics.event_count}
              </span>
              <span className="rounded-full border border-border px-2 py-1 text-muted">
                Duration: {result.metrics.duration_sec}s
              </span>
              {state?.sourceName && (
                <span className="rounded-full border border-border px-2 py-1 text-muted">
                  File: {state.sourceName}
                </span>
              )}
            </div>
          )}

          {tabOutput ? (
            <>
              <MonoBlock text={tabOutput} />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={() => navigator.clipboard.writeText(tabOutput)}
                >
                  Copy
                </Button>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(tabOutput)}`}
                  download={`tabit_${Date.now()}.txt`}
                  className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm hover:border-white/40"
                >
                  Download TXT
                </a>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-muted">No tabs to display. Upload a file first.</p>
              <Link to="/" className="mt-3 inline-block rounded-xl bg-brand-600 px-4 py-2.5 text-sm text-white hover:bg-brand-500">
                Go to Upload
              </Link>
            </div>
          )}
        </CardBody>
      </Card>

      {/* keep your audio/placeholder card on the other column if you like */}
    </div>
  );
}
