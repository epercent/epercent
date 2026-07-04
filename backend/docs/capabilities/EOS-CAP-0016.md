# EOS-CAP-0016: Mission Control Knowledge Asset Viewer & Status Refinement

## Backend Scope

EOS-CAP-0016 extends EOS Core API data contracts for Live Knowledge Objects and registers the Mission Control Knowledge Asset Viewer capability.

## Data Contract

Agent Knowledge Objects now include:

- `lifecycleStatus`
- `previewContent`
- `liveStatus.operationalStatus`
- `liveStatus.lifecycleStatus`

The existing `liveStatus.status` field remains available for backward compatibility.

## Registered Objects

- `EOS-CAP-0016`
- `EOS-ASSET-EXPLORER`
- `EOS-WF-KNOWLEDGE-ASSET-VIEWER`

## Events

- `KNOWLEDGE_ASSET_VIEWED`
- `KNOWLEDGE_ASSET_STATUS_UPDATED`
- `KNOWLEDGE_ASSET_REVIEW_REQUESTED`
- `INVESTOR_BRIEF_AVAILABLE`
- `PUBLICATION_DRAFT_AVAILABLE`

## Verification

`backend/scripts/check-status.js` validates registration, endpoint payloads, lifecycle status, preview content, workflow lookup, and event lookup.
