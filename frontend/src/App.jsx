/* eslint-disable react-hooks/set-state-in-effect */
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
      setMessage(`Upload failed (PDF only?) with error ${err}`);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/documents/${id}`);
    fetchDocs();
  };

  const handleDownload = (id) => {
    window.open(`${API_URL}/documents/${id}`, "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-inter">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📄 Patient Document Portal
      </h1>

      {/* Upload Card */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>

        <form onSubmit={handleUpload} className="flex gap-4 items-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>

        {message && (
          <p className="mt-3 text-green-600 font-medium">{message}</p>
        )}
      </div>

      {/* Documents Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Documents</h2>

        {docs.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  <p className="text-gray-500 text-sm">
                    {Math.round(doc.filesize / 1024)} KB •{" "}
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
}

export default App;
