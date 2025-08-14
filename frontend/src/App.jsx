import { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tabOutput, setTabOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await fetch("http://127.0.0.1:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe file");
      }

      const text = await response.text();
      setTabOutput(text);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎸 Tabit</h1>
      <p>Upload a guitar clip to generate ASCII tabs.</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: '1rem' }}>
          Upload
        </button>
      </form>

      {loading && <p style={{ color: 'blue' }}>Transcribing...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {tabOutput && (
        <pre style={{
          backgroundColor: '#f0f0f0',
          padding: '1rem',
          marginTop: '1rem',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {tabOutput}
        </pre>
      )}
    </div>
  );
}

export default App;
