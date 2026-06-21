# Simple Bucket

Simple Bucket is a small Express-based file storage server. It provides a minimal web UI for uploading files, stores uploaded files on disk, lists saved files, and exposes a simple HTTP API for integrations.

## Features

- Upload files from a browser form.
- Upload files programmatically through `multipart/form-data`.
- Store uploaded files in the local `uploads` directory.
- List all stored files on the home page.
- Download stored files by filename.
- Preserve non-ASCII filenames by converting uploaded names from `latin1` to `utf8`.

## Requirements

- Node.js 14 or newer
- npm

## Installation

```bash
git clone <repository-url>
cd Bucket
npm install
```

## Running

```bash
npm start
```

The server listens on port `2131`.

Open the web UI:

```text
http://127.0.0.1:2131/
```

## Usage

### Upload From The Browser

1. Start the server with `npm start`.
2. Open `http://127.0.0.1:2131/`.
3. Choose a file in the upload form.
4. Submit the form.

Uploaded files are saved in `uploads/` and appear in the file table on the home page.

### Upload With curl

```bash
curl -X POST -F "file=@/path/to/file.txt" http://127.0.0.1:2131/post
```

Successful response:

```json
{
  "message": "File uploaded successfully"
}
```

### Download A File

Use the download link in the web UI, or request the file directly:

```text
http://127.0.0.1:2131/uploads/file.txt
```

## API

### `GET /`

Returns an HTML page with:

- a file upload form
- a table of files stored in `uploads/`
- download links for each stored file

### `POST /post`

Uploads one file.

Request format:

- Content type: `multipart/form-data`
- Field name: `file`

Example:

```bash
curl -X POST -F "file=@/path/to/file.txt" http://127.0.0.1:2131/post
```

Responses:

- `200` with `{ "message": "File uploaded successfully" }` when the file is saved
- `200` with `{}` when the request does not contain a file
- `500` with `Error uploading file` when saving fails

### `GET /uploads/:filename`

Downloads a stored file.

Responses:

- `200` with the requested file
- `404` with `File not found` when the file does not exist or cannot be read
- `500` with `Error downloading file` when download fails after access succeeds

## Project Structure

```text
.
├── README.md
├── package.json
├── package-lock.json
├── routes/
│   └── files.js
├── server.js
├── services/
│   └── storage.js
├── views/
│   ├── filesPage.js
│   └── index.html
└── uploads/
```

Important files:

- `server.js` - Express application setup, configuration, and route registration.
- `routes/files.js` - File upload, listing, and download routes.
- `services/storage.js` - File storage paths, reads, writes, and access checks.
- `views/filesPage.js` - HTML page rendering for the file list.
- `views/index.html` - HTML template for the upload page.
- `uploads/` - local storage directory for uploaded files.
- `package.json` - project metadata, dependencies, and npm scripts.

## npm Scripts

```bash
npm start
```

Starts the server with `node server.js`.

There is currently no build step. The project runs directly with Node.js.

## Storage Behavior

Files are written to the local `uploads/` directory. If the directory does not exist, the server creates it before listing or saving files.

When a new upload has the same filename as an existing file, the existing file is overwritten.

## Development Notes

- The app uses `multer` with in-memory upload handling, then writes the uploaded buffer to disk.
- The current port is hardcoded in `server.js` as `2131`.
- The server does not currently implement authentication, quotas, file type validation, or upload size limits.
- For public or shared deployments, add access control and upload restrictions before exposing the service.

## Troubleshooting

### `EADDRINUSE`

Port `2131` is already occupied. Stop the other process or change the port in `server.js`.

### Uploaded File Does Not Appear

Check that:

- the request uses field name `file`
- the server process has permission to write to `uploads/`
- the upload request completed without a `500` response

### File Download Returns `404`

Check that:

- the file exists in `uploads/`
- the filename in the URL matches the stored filename
- the server process has permission to read the file
