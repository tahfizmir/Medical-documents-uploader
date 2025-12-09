1. Project Overview
Patient Document Portal

A simple full-stack web application that allows users to upload, view, download, and delete PDF documents.
Built using React (TailwindCSS), Node.js/Express, and SQLite.

Features

Upload PDF documents
List all uploaded files
View or download files
Delete documents
Clean, modern UI using TailwindCSS


API Endpoints
Method	Endpoint	           Description

POST	/documents/upload	   Upload a PDF
GET	    /documents	           Get all documents
GET	    /documents/:id	       Download/view a PDF
DELETE	/documents/:id	       Delete a PDF




2. To run it locally

Run backend: cd backend && node server.js

Run frontend: cd frontend && npm run dev

Open the frontend URL (usually http://localhost:5173/)

3. Example API call

curl -X POST http://localhost:5000/documents/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/yourfile.pdf"
