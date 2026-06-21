# AGENTS.md

This file gives coding agents the project-specific context needed to work safely in this repository.

## Project Overview

Simple Bucket is a small Express file storage server. It provides:

- a browser page for uploading and listing files
- `POST /post` for multipart file uploads
- `GET /uploads/:filename` for downloads
- local disk storage in `uploads/`

There is no build step. The app runs directly with Node.js.

## Commands

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Check JavaScript syntax:

```bash
node --check server.js
node --check routes/files.js
node --check services/storage.js
node --check views/filesPage.js
```

The `npm test` script is currently a placeholder and fails intentionally.

## Local Development Rules

- The server listens on port `2131`.
- After changing project files, restart the running server so it uses the latest code.
- Do not run HTTP smoke checks unless the user asks for them.
- Prefer `node --check` for quick syntax verification after JavaScript edits.

## Architecture

Keep responsibilities separated:

- `server.js` should only compose the app: configuration, dependency creation, route registration, and `app.listen`.
- `routes/files.js` should contain HTTP request and response handling.
- `services/storage.js` should contain filesystem operations and storage path logic.
- `views/filesPage.js` should render the file list page and handle HTML escaping.
- `views/index.html` should remain a mostly static HTML template.
- `uploads/` is runtime data and should not be treated as source code.

## Safety Notes

- Always escape filenames before rendering them into HTML.
- Always encode filenames before placing them in download URLs.
- Do not expose new upload routes without thinking about authentication, size limits, file type validation, and path traversal.
- Do not move storage logic back into route handlers or `server.js`.
- Keep template files read once at startup unless there is a clear development-mode requirement.

## Style

- Use CommonJS modules to match the existing codebase.
- Keep changes small and aligned with the current structure.
- Avoid adding new frameworks or template engines unless the project genuinely needs them.
- Update `README.md` when the project structure, commands, or API behavior changes.
