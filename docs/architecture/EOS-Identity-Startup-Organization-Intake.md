# EOS Identity, Startup Experience & Organization Intake

Version: 0.23.0

## Purpose

EOS needs a recognizable operating-system entry point, media identity for humans, agents, and organizations, and a governed path for importing organization source material.

## Identity Media

Identity media supports:

- Human executive profile pictures
- Built-in agent functional avatars
- Company and organization logos managed on organization profiles
- Fallback initials when no image is available
- External repository links for governed media libraries

Local profile media is stored under `data/repository/media` when file size is within the local best-practice threshold.

## Startup Experience

Mission Control starts with a short EOS boot experience before entering:

- Workspace: `enterprise-value`
- Route: `master-monitoring`

The startup sequence reinforces EOS as an executive operating environment rather than a generic dashboard.

## Organization Intake

Organization intake records source material in `data/repository/organization-intake` when local storage is appropriate.

Supported source classes:

- Text
- PDF
- Office documents
- Images
- Audio
- Video
- External cloud-drive repositories

Text files are decoded directly. PDFs and Office documents use a readable string scan until full document parsers are introduced. Audio and video files record metadata only until transcription is implemented.

## External Repository Policy

When source data is large, governed externally, or better managed in a cloud drive, EOS stores a repository link instead of copying the full data set locally.

External links are stored as repository records with provider, URL, sync mode, storage policy, validation status, and live status. Future capabilities may connect these records to Google Drive, GitHub, enterprise document repositories, or object storage.

## API

- `GET /api/startup`
- `GET /api/identity-media`
- `GET /api/identity-media/profiles`
- `GET /api/identity-media/profiles/:id`
- `GET /api/identity-media/assets`
- `GET /api/identity-media/assets/:id`
- `POST /api/identity-media/upload`
- `GET /api/organization-intake`
- `GET /api/organization-intake/:id`
- `POST /api/organization-intake/import`
- `GET /api/repository-links`
- `POST /api/repository-links`

## Persistence

Collections:

- `startup-experience`
- `profile-identities`
- `media-assets`
- `organization-intake-records`
- `organization-repository-links`
- `media-extraction-rules`

## Future Path

Future capabilities should add:

- Full PDF and Office parsing
- Audio transcription
- OCR for images
- Cloud drive synchronization
- Source-to-Enterprise-Object mapping
- Digital Twin Asset generation from organization repositories
- Governed write APIs and audit ledger for repository changes
