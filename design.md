1. Architecture
Frontend

React + Tailwind
Axios for API calls
Pages: Upload section + Document list

Backend

Node.js + Express
Multer for PDF uploads
SQLite for storing file metadata
Local folder (uploads/) for storing actual PDFs

2. Tech Stack

Frontend: React, TailwindCSS, Axios
Backend: Node.js, Express, Multer
Database: SQLite
Storage: Local uploads/ folder

3. Questions

// Tech Stack

Q1. Frontend framework used and why?

React

Simple to build component-based UI
Easy state management and API calls
Large community + TailwindCSS compatibility
Fast development with Vite


Q2. Backend framework used and why?

Express.js (Node.js)
Minimal, fast, and easy to set up
Perfect for simple REST APIs
Works well with file uploads using Multer
Lightweight compared to Django/Flask for this small project


Q3. Database choice and why?

SQLite

Simple file-based SQL database
No server installation needed
Perfect for small projects or assignments
ACID-compliant and easy to query
Fits local development well
If this were a larger system, PostgreSQL or MySQL would be used.

Q4. If supporting 1,000 users, what changes would you consider?

Move from SQLite → PostgreSQL/MySQL
Store files in AWS S3 / Cloudinary instead of local folder
Add caching (Redis)
Add authentication (JWT)
Deploy backend on scalable platforms (Docker + Kubernetes)
Add rate limiting & logging


// Architecture overview

Flow between frontend, backend, database, and file storage

Simple Flow

User selects a PDF in React frontend
React sends upload request to Express backend
Backend uses Multer to store the PDF in /uploads
Backend saves file metadata in SQLite database
When listing files, backend reads metadata from SQLite
For download, backend reads file path and returns the file

3. API Specification

Below is a simple, clean API table with sample requests and responses.

1. Upload Document
POST /documents/upload

Description: Upload a PDF file.

Sample Request (curl):

curl -X POST http://localhost:5000/documents/upload \
  -F "file=@report.pdf"


Sample Response:

{
  "id": 1,
  "filename": "report.pdf",
  "filesize": 204800,
  "created_at": "2025-01-01T10:00:00.000Z"
}

2. List All Documents
GET /documents

Description: Returns metadata for all uploaded documents.

Sample Request:

curl http://localhost:5000/documents


Sample Response:

[
  {
    "id": 1,
    "filename": "report.pdf",
    "filesize": 204800,
    "created_at": "2025-01-01T10:00:00.000Z"
  }
]

3. Download Document
GET /documents/:id

Description: Sends the PDF file for download.

Sample Request:

curl -O http://localhost:5000/documents/1


Response:
Binary PDF file content (browser downloads automatically)

4. Delete Document
DELETE /documents/:id

Description: Delete file from storage and database.

Sample Request:

curl -X DELETE http://localhost:5000/documents/1


Sample Response:

{ "message": "Deleted successfully" }



Q5. Step-by-step process of file upload & download
// When a file is uploaded:

User selects a PDF in the React frontend.

The frontend sends a POST request to /documents/upload with the file in form-data.

Express + Multer receive the file and save it into the local uploads/ folder.

The backend extracts metadata (filename, size, path, timestamp).

Metadata is inserted into the SQLite database.

Backend responds with file details → frontend updates the UI.

// When a file is downloaded/viewed:

User clicks “View/Download” in the React UI.

The frontend calls GET /documents/:id.

Backend looks up the file path in the SQLite database.

Express sends the file back as a download response.

Browser either downloads it or opens it in a PDF viewer.


3. API Endpoints

Method	Endpoint	           Description

POST	/documents/upload	   Upload a PDF
GET	    /documents	           Get all documents
GET	    /documents/:id	       Download/view a PDF
DELETE	/documents/:id	       Delete a PDF


Q6. Assumptions

Only PDF uploads allowed

No authentication

Local file storage is enough

