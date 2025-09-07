import { useLocation, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MonoBlock } from '../components/ui/MonoBlock';

export default function ResultsPage() {
  const { state } = useLocation() as { state?: { tabOutput?: string } };
  const tabOutput = state?.tabOutput ?? '';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader title="Generated tabs" subtitle="Copy or export below" />
        <CardBody>
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
