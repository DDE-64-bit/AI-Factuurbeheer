import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

function App() {
  useEffect(() => {
    document.title = "Factuur Dashboard";
  }, []);

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [facturen, setFacturen] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const mockAxios = {
    post: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { data: { success: true } };
    },
    get: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: [
          {
            leverancier: "Tech Solutions BV",
            datum: "2024-05-15",
            bedragVoorBtw: 850.00,
            bedragNaBtw: 1028.50
          },
          {
            leverancier: "Office Supplies Ltd",
            datum: "2024-05-12",
            bedragVoorBtw: 245.50,
            bedragNaBtw: 297.05
          },
          {
            leverancier: "Marketing Agency",
            datum: "2024-05-10",
            bedragVoorBtw: 1200.00,
            bedragNaBtw: 1452.00
          },
          {
            leverancier: "Cloud Services Inc",
            datum: "2024-05-08",
            bedragVoorBtw: 399.99,
            bedragNaBtw: 483.99
          }
        ]
      };
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('factuur', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('success');
      console.log(response.data);
      fetchFacturen();
      setFile(null);
    } catch (error) {
      setUploadStatus('error');
      console.error(error);
    } finally {
      setIsUploading(false);
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

  const totalVoorBtw = facturen.reduce((sum, f) => sum + (Number(f.bedragVoorBtw) || 0), 0);
  const totalNaBtw = facturen.reduce((sum, f) => sum + (Number(f.bedragNaBtw) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <span>📄</span>
              </div>
              <div>
                <h1 className="header-title">
                  Factuur Dashboard
                </h1>
                <p className="header-subtitle">Beheer en upload uw facturen</p>
              </div>
            </div>
            <div className="header-right">
              <span>📊</span>
              <span>{facturen.length} facturen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <p>Totaal voor BTW</p>
                <p>€{totalVoorBtw.toFixed(2)}</p>
              </div>
              <div className="stat-icon green">
                <span>💰</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <p>Totaal na BTW</p>
                <p>€{totalNaBtw.toFixed(2)}</p>
              </div>
              <div className="stat-icon blue">
                <span>💳</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <p>BTW Bedrag</p>
                <p>€{(totalNaBtw - totalVoorBtw).toFixed(2)}</p>
              </div>
              <div className="stat-icon purple">
                <span>📈</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Upload Section */}
          <div>
            <div className="upload-section">
              <div className="section-header">
                <span>➕</span>
                <h2>Nieuwe Factuur</h2>
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />

                <div className="drop-content">
                  <div className={`drop-icon ${file ? 'success' : ''}`}>
                    {file ? <span>✅</span> : <span>📤</span>}
                  </div>

                  {file ? (
                    <div className="drop-text success">
                      <p>Bestand geselecteerd</p>
                      <p>{file.name}</p>
                    </div>
                  ) : (
                    <div className="drop-text">
                      <p>Sleep een afbeelding hierheen</p>
                      <p>of klik om te selecteren</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="upload-button"
              >
                {isUploading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    <span>Uploaden...</span>
                  </div>
                ) : (
                  'Upload Factuur'
                )}
              </button>

              {/* Status Message */}
              {uploadStatus && (
                <div className={`status-message ${uploadStatus}`}>
                  {uploadStatus === 'success' ? (
                    <span>✅</span>
                  ) : (
                    <span>❌</span>
                  )}
                  <span>
                    {uploadStatus === 'success' ? 'Upload geslaagd!' : 'Upload mislukt.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Facturen List */}
          <div>
            <div className="facturen-section">
              <div className="facturen-header">
                <div className="section-header">
                  <span>📄</span>
                  <h2>Recente Facturen</h2>
                </div>
              </div>

              <div className="facturen-list">
                {facturen.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <span>📄</span>
                    </div>
                    <p>Geen facturen gevonden</p>
                    <p>Upload uw eerste factuur om te beginnen</p>
                  </div>
                ) : (
                  facturen.map((factuur, index) => (
                    <div key={index} className="factuur-item">
                      <div className="factuur-content">
                        <div className="factuur-left">
                          <div className="factuur-icon">
                            <span>📄</span>
                          </div>
                          <div className="factuur-details">
                            <h3>{factuur.leverancier}</h3>
                            <div className="factuur-date">
                              <span>📅</span>
                              <span>{new Date(factuur.datum).toLocaleDateString('nl-NL')}</span>
                            </div>
                            <div className="factuur-amounts">
                              <div>
                                <span>Voor BTW:</span>
                                <span>
                                  €{factuur.bedragVoorBtw ? Number(factuur.bedragVoorBtw).toFixed(2) : 'onbekend'}
                                </span>
                              </div>
                              <div>
                                <span>Na BTW:</span>
                                <span>
                                  €{factuur.bedragNaBtw ? Number(factuur.bedragNaBtw).toFixed(2) : 'onbekend'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="factuur-total">
                          <div>
                            €{factuur.bedragNaBtw ? Number(factuur.bedragNaBtw).toFixed(2) : 'onbekend'}
                          </div>
                          <div>Totaal incl. BTW</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
