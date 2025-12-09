import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDocs = async () => {
    const res = await axios.get(`${API_URL}/documents`);
    setDocs(res.data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Uploaded successfully");
      setFile(null);
      fetchDocs();
    } catch (err) {
      setMessage("Upload failed (PDF only?)");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/documents/${id}`);
    fetchDocs();
  };

  const handleDownload = (id) => {
    window.location.href = `${API_URL}/documents/${id}`;
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>Patient Document Portal</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Your Documents</h3>
      {docs.length === 0 && <p>No documents yet.</p>}

      <ul>
        {docs.map((doc) => (
          <li key={doc.id} style={{ marginBottom: 8 }}>
            {doc.filename} ({Math.round(doc.filesize / 1024)} KB)
            <button onClick={() => handleDownload(doc.id)} style={{ marginLeft: 8 }}>
              Download
            </button>
            <button onClick={() => handleDelete(doc.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
