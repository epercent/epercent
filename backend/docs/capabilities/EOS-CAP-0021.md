# EOS-CAP-0021: EOS Executive Council & Digital Enterprise Headquarters

## Backend Scope

EOS-CAP-0021 adds the Executive Council and Digital Enterprise Headquarters data layer to EOS Core API.

## API

- `GET /api/executive-council`
- `GET /api/executive-council/:id`

## Data Model

The Executive Council payload includes the council record, Digital Enterprise Headquarters record, CEO cockpit summary, executive count, and executive profiles.

Each executive profile includes id, name, role, type, department, reportsTo, responsibilities, currentFocus, status, healthScore, progress, attentionLevel, requiresAttention, summary, recommendedAction, availableActions, linkedEnterpriseObjects, linkedPrograms, and lastActivity.

## Registered Objects

- `EOS-CAP-0021`
- `EOS-EXECUTIVE-COUNCIL`
- `EOS-DIGITAL-ENTERPRISE-HEADQUARTERS`
- `EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE`

## Events

- `EXECUTIVE_COUNCIL_CREATED`
- `EXECUTIVE_PROFILE_UPDATED`
- `EXECUTIVE_ATTENTION_REQUIRED`
- `CEO_COCKPIT_UPDATED`
- `DIGITAL_HEADQUARTERS_CREATED`

## Verification

`backend/scripts/check-status.js` validates Executive Council payloads, CEO cockpit fields, executive profile schema, action labels, Enterprise Object registration, workflow lookup, and event lookup.
