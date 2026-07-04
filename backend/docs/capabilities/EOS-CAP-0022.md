# EOS-CAP-0022: Executive Action & Approval Framework

## Backend Scope

EOS-CAP-0022 adds read-only executive action governance to EOS Core API.

## API

- `GET /api/executive-actions`
- `GET /api/executive-actions/:id`
- `GET /api/executive-actions/pending-approval`

## Data Model

Each Executive Action includes id, label, description, owner, requester, targetObject, targetType, sourceExecutive, status, approvalRequired, approvalStatus, riskLevel, createdAt, updatedAt, linkedWorkflow, linkedEvents, auditTrail, availableDecisionActions, recommendedNextStep, executionEnabled, and executionStatus.

## Registered Objects

- `EOS-CAP-0022`
- `EOS-EXECUTIVE-ACTION-FRAMEWORK`
- `EOS-APPROVAL-QUEUE`
- `EOS-WF-EXECUTIVE-ACTION-GOVERNANCE`

## Events

- `EXECUTIVE_ACTION_CREATED`
- `EXECUTIVE_ACTION_REVIEW_REQUESTED`
- `EXECUTIVE_ACTION_APPROVED`
- `EXECUTIVE_ACTION_REJECTED`
- `EXECUTIVE_ACTION_ESCALATED`
- `EXECUTIVE_ACTION_DEFERRED`

## Verification

`backend/scripts/check-status.js` validates Executive Action payloads, pending approval queue, non-execution safety, Enterprise Object registration, workflow lookup, and event lookup.
