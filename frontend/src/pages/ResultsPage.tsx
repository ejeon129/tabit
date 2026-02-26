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
  const eventsPreview = result?.events?.slice(0, 8) ?? [];

  return (
    <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
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

      <Card>
        <CardHeader title="Analysis summary" subtitle="Quick session details" />
        <CardBody className="space-y-4">
          {result ? (
            <>
              <div className="rounded-xl border border-border bg-white/85 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Metrics</p>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted">Detected notes</p>
                    <p className="text-lg font-semibold">{result.metrics.event_count}</p>
                  </div>
                  <div>
                    <p className="text-muted">Clip length</p>
                    <p className="text-lg font-semibold">{result.metrics.duration_sec}s</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white/85 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">First notes</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {eventsPreview.map((event, idx) => (
                    <li key={`${event.time_sec}-${event.note}-${idx}`} className="flex justify-between">
                      <span>{event.note}</span>
                      <span className="text-muted">S{event.string} • F{event.fret}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Run a transcription to see metrics and note mapping details.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
