import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('afbeelding', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Upload geslaagd!');
      console.log(response.data);
    } catch (error) {
      setUploadStatus('Upload mislukt.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Afbeelding uploaden</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>
        Upload
      </button>
      <p>{uploadStatus}</p>
    </div>
  );
}

export default App;
