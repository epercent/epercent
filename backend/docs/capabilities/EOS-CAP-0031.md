# EOS-CAP-0031: Identity, Startup Experience & Organization Intake Foundation

Version: 0.23.0

Status: Completed

EOS-CAP-0031 adds backend and Mission Control foundations for human profile pictures, built-in functional agent avatars, company logos, startup experience, organization intake, useful extraction metadata, and external cloud repository links.

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

## Data

- `startup-experience`
- `profile-identities`
- `media-assets`
- `organization-intake-records`
- `organization-repository-links`
- `media-extraction-rules`

## Registered Objects

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
