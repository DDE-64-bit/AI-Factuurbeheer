import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [facturen, setFacturen] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('factuur', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Upload geslaagd!');
      console.log(response.data);
      fetchFacturen();
    } catch (error) {
      setUploadStatus('Upload mislukt.');
      console.error(error);
    }
  };

  const fetchFacturen = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/getFacturen/');
      setFacturen(res.data);
    } catch (err) {
      console.error('Fout bij ophalen facturen:', err);
    }
  };

  useEffect(() => {
    fetchFacturen();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Afbeelding uploaden</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>
        Upload
      </button>
      <p>{uploadStatus}</p>

      <hr />

      <h3>Huidige facturen</h3>
      <ul>
        {facturen.map((factuur, index) => (
          <li key={index}>
            {factuur.leverancier} – {factuur.datum} <br />
            Bedrag vóór btw: €{factuur.bedragVoorBtw ? Number(factuur.bedragVoorBtw).toFixed(2) : 'onbekend'}<br />
            Bedrag ná btw: €{factuur.bedragNaBtw ? Number(factuur.bedragNaBtw).toFixed(2) : 'onbekend'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
