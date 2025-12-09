const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());


const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});


const db = new sqlite3.Database(path.join(__dirname, "documents.db"));
db.run(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

app.post("/documents/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { filename, path: filepath, size } = req.file;
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO documents (filename, filepath, filesize, created_at)
     VALUES (?, ?, ?, ?)`,
    [filename, filepath, size, createdAt],
    function (err) {
      if (err) return res.status(500).json({ message: "DB error" });
      return res.json({
        id: this.lastID,
        filename,
        filesize: size,
        created_at: createdAt,
      });
    }
  );
});


app.get("/documents", (req, res) => {
  db.all(`SELECT id, filename, filesize, created_at FROM documents`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});


app.get("/documents/:id", (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM documents WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: "File not found" });
    res.download(row.filepath, row.filename);
  });
});

app.delete("/documents/:id", (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM documents WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: "File not found" });

    fs.unlink(row.filepath, (fsErr) => {
      if (fsErr) console.error(fsErr);
      db.run(`DELETE FROM documents WHERE id = ?`, [id], (dbErr) => {
        if (dbErr) return res.status(500).json({ message: "DB error" });
        res.json({ message: "Deleted successfully" });
      });
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Backend running on http://localhost:" + PORT));
