# EOS-CAP-0023: Executive Office Framework

## Backend Scope

EOS-CAP-0023 adds Executive Office records and APIs to EOS Core API.

## API

- `GET /api/executive-offices`
- `GET /api/executive-offices/:id`

## Data Model

Each office includes executive identity, department, status, healthScore, currentFocus, executiveBriefing, todaysSummary, currentPriorities, itemsRequiringCeoAttention, recommendedActions, estimatedCeoReviewTime, departmentHealth, KPIs, projects, capabilities, programs, liveEnterpriseObjects, knowledgeAssets, workflows, recentEvents, recentActivityTimeline, departmentPortfolio, approvalsWaiting, messages, meetings, calendar, temporaryAgents, permanentAgents, availableActions, specificWidgets, businessValue, and liveStatus.

## Registered Objects

- `EOS-CAP-0023`
- `EOS-EXECUTIVE-OFFICE-FRAMEWORK`
- `EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT`

## Events

- `EXECUTIVE_OFFICE_OPENED`
- `EXECUTIVE_BRIEFING_UPDATED`
- `DEPARTMENT_STATUS_UPDATED`

## Verification

`backend/scripts/check-status.js` validates Executive Office payloads, office lookup, schema fields, executive-specific widgets, Enterprise Object registration, workflow lookup, and event lookup.
