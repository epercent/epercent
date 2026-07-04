# EOS-CAP-0014: EOS Live Object Status Layer

## Purpose

EOS-CAP-0014 registers the Live Object Status Layer in the backend registry model.

## Backend Registry Changes

- Registered `EOS-CAP-0014` as a Capability Enterprise Object.
- Registered `EOS-WF-LIVE-OBJECT-STATUS-LAYER` as a Workflow Enterprise Object.
- Added live status event types and events.
- Added a live status service that attaches `liveStatus` to Enterprise Object API responses.
- Updated EOS Core API status version to `0.9.0`.

## Verification

Automated verification checks every Enterprise Object for a valid `liveStatus` object and confirms Backup & Recovery reports Amber when restore validation is incomplete.
