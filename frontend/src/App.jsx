import { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // For now, just log the file. We'll send it to Flask later.
    console.log("Submitting file:", selectedFile);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎸 Tabit</h1>
      <p>Upload a guitar clip to generate tabs.</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: '1rem' }}>
          Upload
        </button>
      </form>

      {selectedFile && (
        <p style={{ marginTop: '1rem' }}>
          Selected: <strong>{selectedFile.name}</strong>
        </p>
      )}
    </div>
  );
}

export default App;
