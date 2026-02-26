import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dropzone } from '../components/ui/Dropzone';

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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const navigate = useNavigate();

  const accept = [
    'audio/wav','audio/x-wav','audio/mpeg','audio/mp3','audio/mp4','audio/aac','audio/x-m4a','audio/ogg','audio/flac'
  ];
  const allowedExtensions = ['wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac'];

  const onFile = (f: File) => {
    const extension = f.name.split('.').pop()?.toLowerCase();
    const extensionAllowed = extension ? allowedExtensions.includes(extension) : false;
    const mimeAllowed = accept.includes(f.type);
    if (!mimeAllowed && !extensionAllowed) {
      return setError('Unsupported file. Use .wav, .mp3, .m4a, .aac, .ogg, or .flac');
    }
    if (f.size > 30 * 1024 * 1024) return setError('File too large (≤ 30 MB).');
    setError(null);
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a file first.'); return; }

    const form = new FormData();
    form.append('audio', file);

    setLoading(true);
    setStage('Transcribing...');
    setError(null);
    try {
      const res = await fetch('/transcribe', { method: 'POST', body: form });
      const raw = await res.text();

      let payload: TranscribeResponse | { error?: string } | null = null;
      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch {
        payload = null;
      }

      if (!res.ok) {
        const message = (payload as { error?: string } | null)?.error ?? raw ?? `HTTP ${res.status}`;
        throw new Error(message);
      }

      const result = payload as TranscribeResponse | null;
      if (!result?.ascii_tab) {
        throw new Error('Backend returned an unexpected response.');
      }

      navigate('/result', { state: { result, sourceName: file.name } });
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong while transcribing.');
    } finally {
      setLoading(false);
      setStage(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Convert a guitar clip to tabs</h1>
        <p className="mt-2 text-sm text-muted">Upload a short recording to generate tablature.</p>
      </div>

      <Card>
        <CardBody>
          <Dropzone onFile={onFile} />

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
              <div>
                <strong className="font-medium">{file.name}</strong>
                <span className="text-muted"> • {(file.size/1024/1024).toFixed(1)} MB</span>
              </div>
              <Button
                onClick={handleAnalyze}
                loading={loading}
                disabled={!file || loading}
              >
                {loading ? 'Analyzing…' : 'Analyze'}
              </Button>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-danger-500">{error}</p>}
          {loading && stage && <p className="mt-3 text-xs text-muted">{stage}</p>}

        </CardBody>
      </Card>
    </div>
  );
}
