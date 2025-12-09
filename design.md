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

Q. Step-by-step process of file upload & download
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


4. Assumptions

Only PDF uploads allowed

No authentication

Local file storage is enough

