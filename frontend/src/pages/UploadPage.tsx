import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tabOutput, setTabOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setTabOutput('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an audio file first!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);

    setLoading(true);
    setError('');
    setTabOutput('');

    try {
      // If your Vite proxy is set, you can use '/transcribe' instead of the full URL
      const response = await fetch("/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to transcribe file");

      const text = await response.text();
      setTabOutput(text);

      // Navigate to results and pass the output
      navigate('/result', { state: { tabOutput: text } });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-md p-6">
      <h1 className="text-3xl font-bold">🎸 Tabit</h1>
      <p className="mt-1 text-slate-400">Upload a guitar clip to generate ASCII tabs.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Transcribing…' : 'Upload'}
        </button>
      </form>

      {error && <p className="mt-3 text-red-400">Error: {error}</p>}
    </div>
  );
}
