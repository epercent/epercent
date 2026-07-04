# EOS-CAP-0020: EOS Program Management Office (PMO) & Master Roadmap

## Backend Scope

EOS-CAP-0020 adds EOS PMO and Master Roadmap data to EOS Core API.

## API

- `GET /api/pmo`
- `GET /api/pmo/master-roadmap`

## Data Model

The Master Roadmap includes programs, phases, milestones, capabilities, dependencies, risks, current sprint, current capability, business value, research value, investor value, progress, health, recommended action, available actions, and `liveStatus`.

## Registered Objects

- `EOS-CAP-0020`
- `EOS-PMO`
- `EOS-MASTER-ROADMAP`
- `EOS-WF-PROGRAM-MANAGEMENT`

## Events

- `PROGRAM_CREATED`
- `PROGRAM_UPDATED`
- `MILESTONE_COMPLETED`
- `ROADMAP_UPDATED`
- `SPRINT_STARTED`
- `SPRINT_COMPLETED`

## Verification

`backend/scripts/check-status.js` validates PMO payloads, roadmap schema, program metadata, capability impact metadata, workflow lookup, and event lookup.
