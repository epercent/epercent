# EOS-CAP-0031: Identity, Startup Experience & Organization Intake Foundation

Version: 0.23.0

Status: Completed

EOS-CAP-0031 adds the first identity media, startup experience, and organization intake foundation for EOS. Human executives can hold profile picture metadata, agents use built-in functional avatars, and organizations own logo metadata. Mission Control starts with a modern EOS boot experience. Organization files can be imported locally when appropriate, while large repositories can be represented by external cloud-drive links.

## Scope

Implemented:

- EOS Startup Experience
- Profile identity registry for humans, agents, executive advisor, and organization profiles
- Human profile picture, functional agent avatar, and company logo foundation
- Media asset registry with checksum, storage mode, metadata, and extraction status
- Organization intake registry for useful source material
- External repository link foundation for cloud-scale data sets
- Mission Control Platform views for Startup Experience, Identity Media, Organization Intake, and Repository Links
- Persistent storage collections for identity and intake data

Not implemented:

- Real cloud-drive synchronization
- Full PDF or Office document parsing
- Audio transcription
- OCR
- Automatic Digital Twin generation from imported material

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

## Enterprise Objects

Registered:

- `EOS-CAP-0031`
- `EOS-STARTUP-EXPERIENCE`
- `EOS-IDENTITY-MEDIA-REGISTRY`
- `EOS-MEDIA-ASSET-STORE`
- `EOS-ORGANIZATION-INTAKE`
- `EOS-EXTERNAL-REPOSITORY-LINKS`

## Workflow

- `EOS-WF-ORGANIZATION-INTAKE`

## Events

- `STARTUP_EXPERIENCE_LOADED`
- `PROFILE_MEDIA_UPLOADED`
- `ORGANIZATION_LOGO_REGISTERED`
- `ORGANIZATION_IMPORT_RECEIVED`
- `INTAKE_EXTRACTION_COMPLETED`
- `ORGANIZATION_REPOSITORY_LINKED`

## Verification

Automated verification validates new endpoints, persistent collections, Enterprise Objects, workflow, event types, event records, identity profiles, repository link creation, external media registration, and small organization source import with text extraction.

## Repository Policy

Small, appropriate source files may be stored locally under `data/repository`. Large or governed repositories should remain in external cloud drives and be represented by repository link records until future synchronization and audit controls are implemented.
