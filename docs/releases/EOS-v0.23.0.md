# EOS Alpha 0.23.0 - Identity, Startup Experience & Organization Intake Foundation

Release Date: 2026-07-03

Capability: EOS-CAP-0031

## Summary

EOS Alpha 0.23.0 adds identity media, startup experience, and organization intake foundations. Mission Control now has a modern EOS startup screen, profile media surfaces for human and agent profiles, company logo support, organization source import, metadata extraction, and external repository links for large or cloud-governed source material.

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

## Persistent Data

- Startup experience
- Profile identities
- Media assets
- Organization intake records
- Organization repository links
- Media extraction rules

## Known Limitations

- Cloud-drive synchronization is not active.
- Full PDF and Office parsing is not implemented.
- Audio transcription and OCR are future capabilities.
- Imported source material does not yet auto-generate Enterprise Objects or Digital Twin Assets.

## Next Release Objectives

- Persistent Write API & Governance Audit Ledger
- DTA Lifecycle Management
- Valuation Engine Expansion
- Temporary Agent Creation / Agent Hiring
