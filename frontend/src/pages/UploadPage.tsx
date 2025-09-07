import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dropzone } from '../components/ui/Dropzone';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const accept = [
    'audio/wav','audio/x-wav','audio/mpeg','audio/mp3','audio/mp4','audio/aac','audio/x-m4a'
  ];

  const onFile = (f: File) => {
    if (!accept.includes(f.type)) return setError('Unsupported file. Use .wav, .mp3, or .m4a');
    if (f.size > 30 * 1024 * 1024) return setError('File too large (≤ 30 MB).');
    setError(null);
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a file first.'); return; }

    const form = new FormData();
    form.append('audio', file);

    setLoading(true);
    setError(null);
    try {
      // uses your Vite proxy: '/transcribe' -> http://127.0.0.1:5000/transcribe
      const res = await fetch('/transcribe', { method: 'POST', body: form });
      const text = await res.text();              // read body either way for better errors
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

      // go to results and pass the tabs
      navigate('/result', { state: { tabOutput: text } });
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong while transcribing.');
    } finally {
      setLoading(false);
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

        </CardBody>
      </Card>
    </div>
  );
}
