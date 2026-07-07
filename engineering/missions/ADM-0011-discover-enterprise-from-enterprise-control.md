# ADM-0011 — Discover Enterprise from Enterprise Control

## Objective

Enable Enterprise Control to accept a user-entered enterprise website or company source, run Enterprise Discovery, and update the Enterprise Control screen with the returned runtime.

## Business Objective

EOS must demonstrate that a user can begin with an enterprise source and immediately receive enterprise intelligence.

## User Journey

User opens EOS
→ lands on Enterprise Control
→ enters website URL
→ clicks Discover Enterprise
→ EOS calls Enterprise Discovery API
→ Enterprise Control updates with:
- Enterprise name
- Digital Intelligence Profile
- Discovery confidence
- Website intelligence
- Opportunity Assessment
- AI Workforce Recommendation
- Digital Twin status
- Second Balance Sheet signal
- Recommended next actions

## Existing Backend API

Use:

POST /api/enterprise-discovery

Expected payload:

{
  "source": "https://example.com",
  "entityType": "Enterprise",
  "name": "Example Enterprise"
}

## Existing Runtime Objects

Reuse:

- missionControlRuntime
- profile
- websiteDiscovery
- opportunityAssessment
- aiWorkforceRecommendation
- digitalTwinPlaceholder
- secondBalanceSheetSignal

## Frontend Files Likely Affected

Modify:

- frontend/src/enterprise-control/EnterpriseControlShell.jsx
- frontend/src/enterprise-control/EnterpriseControl.css
- frontend/src/App.jsx
- frontend/src/services/api.js

Do not remove existing legacy workspace screens.

## Required Functionality

1. Add input field for website/company source.
2. Add Discover Enterprise button.
3. On click, call backend Enterprise Discovery API.
4. Show loading/progress state.
5. Update Enterprise Control with returned runtime.
6. Show clear error message if discovery fails.
7. Preserve Open Mission Control button.
8. Do not show duplicate workspace navigation on Enterprise Control landing page.

## Visual Requirement

Enterprise Control should feel executive and calm.

The discovery action should feel like the start of the EOS journey.

Use stage labels:

- Discovering Enterprise
- Building Digital Intelligence Profile
- Assessing Opportunities
- Recommending AI Workforce
- Initializing Digital Twin
- Generating Second Balance Sheet Signal
- Updating Enterprise Control

A simple animated placeholder is acceptable for v1.

## Acceptance Criteria

Mission is complete when:

1. Opening EOS shows Enterprise Control by default.
2. User can enter a website URL.
3. Clicking Discover Enterprise triggers POST /api/enterprise-discovery.
4. Returned runtime updates the visible page.
5. Enterprise name changes based on input.
6. Discovery confidence is visible.
7. Opportunity Assessment is visible.
8. AI Workforce recommendation is visible.
9. Digital Twin status is visible.
10. Second Balance Sheet signal is visible.
11. Open Mission Control still works.
12. Existing backend tests are not broken.
13. Frontend builds successfully.

## Test Commands

Run:

npm run build

from:

frontend/

Run backend API test:

cd backend

node -e "
import('./src/services/enterprise-discovery-orchestrator-service.js')
.then(async m => {
 const r = await m.runEnterpriseDiscovery({
   source:'https://epercent.ai',
   entityType:'Enterprise',
   name:'ePercent'
 });
 console.log('Enterprise:', r.profile.name);
 console.log('Runtime:', r.missionControlRuntime.runtime.status);
 console.log('Second Balance Sheet:', r.secondBalanceSheetSignal.status);
})
.catch(console.error);
"

## Commit Message

Implement ADM-0011 discover enterprise from Enterprise Control

## Definition of Done

ADM-0011 is complete when the browser can demonstrate the discovery journey from Enterprise Control without manual backend calls.
