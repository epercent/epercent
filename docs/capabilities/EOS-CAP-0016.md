# EOS-CAP-0016: Mission Control Knowledge Asset Viewer & Status Refinement

## Purpose

EOS-CAP-0016 upgrades Mission Control from a static dashboard into a portfolio-aware command center for Live Knowledge Objects.

## Scope

- Added Mission Control Operational Mode and Portfolio Mode.
- Added a Knowledge Asset Viewer for Agent Knowledge Repository objects.
- Added Knowledge Object detail inspection for lifecycle status, operational status, progress, related records, publication readiness, investor readiness, patent potential, linked documents, recommended action, and available actions.
- Added structured preview content for Athena research projects `RP-001` through `RP-004`.
- Extended `liveStatus` with `operationalStatus` and `lifecycleStatus` while preserving the existing `status` field.
- Replaced executive-facing `None` status values with meaningful lifecycle or action-oriented language.

## Enterprise Objects

- `EOS-CAP-0016`
- `EOS-ASSET-EXPLORER`
- `EOS-WF-KNOWLEDGE-ASSET-VIEWER`

## Workflow

- `EOS-WF-KNOWLEDGE-ASSET-VIEWER`

## Events

- `KNOWLEDGE_ASSET_VIEWED`
- `KNOWLEDGE_ASSET_STATUS_UPDATED`
- `KNOWLEDGE_ASSET_REVIEW_REQUESTED`
- `INVESTOR_BRIEF_AVAILABLE`
- `PUBLICATION_DRAFT_AVAILABLE`

## Verification

Automated verification checks capability registration, asset explorer registration, workflow registration, event coverage, lifecycle status fields, preview content, and AKR endpoint responses.
