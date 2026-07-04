# EOS Development Guide

## Project Structure

EOS currently keeps the running application in:

- `backend/` for EOS Core API
- `frontend/` for Mission Control

The workspace now also includes future-facing standard folders:

- `services/` for backend service decomposition
- `apps/` for product applications
- `agents/` for agent definitions and runtime assets
- `docs/` for architecture, genesis, and capability documentation
- `tests/` for workspace-level tests
- `scripts/` for developer automation
- `infrastructure/` for deployment and environment configuration

Existing source files have not been moved, which keeps the current application stable.

## How EOS Starts

Run EOS from the workspace root:

```bash
npm run eos:start
```

The command starts EOS Core API and Mission Control, verifies both are reachable, and prints the local URLs and build version.

## Platform Audit

Run the audit from the workspace root:

```bash
npm run eos:audit
```

The audit generates `docs/audits/EOS-Platform-Audit-v0.25.0.json` and reports:

- Capability readiness
- API coverage
- Frontend route coverage
- Persistence health
- Placeholder and display-only register
- Technical debt register
- Alpha, Beta, Release Candidate, and Version 1.0 readiness scoring
- Recommended next build sequence

## Coding Standards

- Keep backend capabilities organized by data, service, controller, and route layers.
- Keep frontend features split into services and reusable components.
- Prefer explicit seeded registries until durable persistence is introduced.
- Preserve existing application behavior while preparing migrations incrementally.
- Mission Control navigation should use workspace-based patterns instead of long global menus.
- Mission Control should lead with Enterprise Value and use the Master Monitoring dark executive theme as the platform default.
- Profile identity, media upload, and organization intake work should use the identity/intake service boundary rather than writing directly to storage.

## Capability Development Process

Before implementation:

1. Produce an EOS Engineering Estimate.
2. Wait for approval unless explicitly instructed otherwise.

During implementation:

1. Register the capability as an Enterprise Object.
2. Add or update capability documentation.
3. Update build/version metadata.
4. Update the changelog.
5. Add automated verification.
6. Ensure lint, build, and verification pass.
7. Update audit readiness evidence when the capability changes platform functionality.

After implementation:

1. Produce an EOS Capability Completion Report.
2. Produce an EOS Business Impact Assessment.
3. Produce an EOS Genesis Update.
4. Include actual engineering metrics.
5. Recommend the next capability.

## Engineering Rules

- No manual editing required from the user.
- Every completed capability must be workflow-aware whenever possible.
- Every completed capability must be reflected in EOS documentation and verification.
- Every completed capability must produce the three mandatory reports defined in `docs/architecture/EOS-Engineering-Standard.md`.
- Prefer additive migrations over disruptive file moves.
- Every Enterprise Object API response must include a valid `liveStatus` object.
- Executive-facing status values must avoid empty labels such as `None`; use lifecycle or action-oriented values such as `No Action Required`, `Pending Assessment`, `Draft`, `Idea`, `Review`, or `Verified`.

## Live Object Status

Enterprise Objects expose a standard `liveStatus` object:

- `status`: Green, Amber, Red, Blue, or Grey.
- `operationalStatus`: Green, Amber, Red, Blue, or Grey.
- `lifecycleStatus`: Idea, Defined, Draft, Research, Building, Testing, Verified, Review, Approved, Published, Archived, Not Started, In Progress, or Pending Assessment.
- `healthScore`: 0-100 operational health.
- `progress`: 0-100 completion or readiness.
- `summary`: concise operational state.
- `lastActivity`: latest status activity timestamp.
- `requiresAttention`: whether human intervention is required.
- `attentionLevel`: No Action Required, Low, Medium, High, or Critical.
- `recommendedAction`: next recommended action.
- `availableActions`: action labels Mission Control can display.

Backup & Recovery objects must report Amber when restore validation has not completed.

## Git Workflow

- Initialize Git before continuing development.
- Keep generated runtime data out of version control.
- Commit capability work in coherent capability-sized changes.
- Do not commit `node_modules`, `.eos/`, logs, or local environment files.

## Testing

Use:

```bash
npm run eos:test
```

This runs backend lint, backend build, backend endpoint verification, frontend lint, and frontend build.

The test suite also runs `npm run eos:audit` so the audit report is generated during normal verification.

## Versioning

EOS currently updates version metadata in package files, API status output, changelog entries, and Enterprise Objects. This should be centralized in a future capability.

## Persistent Data Store

EOS Core API initializes persistent local JSON collections from seeded registries on startup.

Storage directories:

- `data/store/` stores collection envelopes.
- `data/snapshots/` stores future point-in-time storage snapshots.
- `data/schema/` documents the storage envelope schema.

Storage endpoints:

- `GET /api/storage/status`
- `GET /api/storage/collections`
- `GET /api/storage/collections/:name`

Backend services should use `backend/src/services/storage-service.js` for registry reads and record lookup when persistence is available. Seed data remains the fallback source so development stays deterministic and existing APIs preserve their response shapes.

Future write capabilities should extend the storage service instead of writing JSON files directly. The service boundary should remain stable so EOS can later migrate to PostgreSQL without changing controllers or Mission Control.

## Identity Media And Organization Intake

EOS supports profile media and organization intake through:

- `GET /api/startup`
- `GET /api/identity-media`
- `POST /api/identity-media/upload`
- `GET /api/organization-intake`
- `POST /api/organization-intake/import`
- `GET /api/repository-links`
- `POST /api/repository-links`

Identity media includes human executive profile pictures, built-in functional agent avatars, company logos, organization logos, fallback initials, and external repository policies. Agents do not use uploaded profile photos because they may be hired across organizations in the EOS ecosystem; organization logos remain organization-level identity.

Organization intake supports local files and external repository links. Small files may be stored under `data/repository` when appropriate. Large files, media libraries, governed source archives, or cloud-scale repositories should be represented by external repository link records until synchronization, permissions, and audit controls exist.

Initial extraction behavior is intentionally conservative:

- Text files: direct UTF-8 preview extraction.
- PDFs: readable string scan.
- Office documents: readable string scan.
- Audio and video: metadata only until transcription is implemented.

Future parsers, OCR, transcription, and Digital Twin generation should extend `backend/src/services/identity-intake-service.js`.

## Enterprise Onboarding And DTA Assimilation

Enterprise onboarding and DTA assimilation use persistent collections and read-only API views until write governance, external connectors, and AI extraction are implemented.

Endpoints:

- `GET /api/onboarding`
- `GET /api/onboarding/:id`
- `GET /api/onboarding/:id/pipeline`
- `GET /api/onboarding-assimilation`
- `GET /api/digital-mirrors`
- `GET /api/digital-mirrors/:id`
- `GET /api/dta-candidates`
- `GET /api/dta-candidates/:id`
- `GET /api/data-feed-requirements`
- `GET /api/data-feed-requirements/:enterpriseId`
- `GET /api/human-validation`
- `GET /api/human-validation/:enterpriseId`

Do not claim real AI extraction, live source integration, or DTA formation execution until those capabilities are implemented and verified. The current layer is a structured onboarding, Digital Mirror, DTA candidate, feed requirement, agent assignment, and human validation framework.

## Knowledge Management

Capability documents live under capability documentation folders. EOS Genesis and architectural decisions should be captured under `docs/genesis/` and `docs/architecture/`.

## Agent Knowledge Repository

Executive agents own Agent Knowledge Repositories. Each repository contains structured Knowledge Objects for research, publications, reports, intellectual property, operational knowledge, Genesis entries, business impact assessments, and decision records.

AKR endpoints:

- `GET /api/knowledge-repositories`
- `GET /api/knowledge-repositories/:agent`
- `GET /api/knowledge-objects`
- `GET /api/knowledge-objects/:id`

Every Agent Knowledge Object must include the Live Enterprise Object interface through `liveStatus`.

Agent Knowledge Objects that are shown in Mission Control Portfolio Mode must include preview content sections for executive summary, core argument, research questions, commercial relevance, related EOS capability, and next drafting step.

## Mission Control Modes

Mission Control supports:

- CEO Cockpit for platform health, executive attention, office readiness, approvals, and roadmap context.
- Executive Council for leadership overview and office entry.
- Executive Offices for department-level work, KPIs, portfolios, approvals, knowledge, workflows, and placeholders.
- Programs and Roadmap for PMO governance.
- Assets for Enterprise Object health, attention, progress, lifecycle status, and recommended actions.
- Knowledge for knowledge assets, white papers, academic papers, research notes, investor briefs, patent opportunities, and future publication workflows.

## Mission Control Navigation Standard

Mission Control should open into Enterprise Value, with Master Monitoring as the default screen. The first screen should show enterprise value, Digital Twin Assets, enterprise health, operational systems, telemetry, governance status, human approval points, and current priority. Master Monitoring keeps the onboarded enterprise count in its summary, while detailed enterprise and organization portfolio review belongs in the dedicated Onboarded Enterprises view. The Digital Headquarters Lobby remains available for workspace selection.

Use these navigation layers:

- Executive Command Bar for identity, workspace context, headline metrics, attention, command/search, and Presentation Mode.
- Primary Workspace Rail for Enterprise Value, Headquarters, Enterprise, AI Workforce, Knowledge, Platform, Development, and My Workspace.
- Context Navigation for the active workspace only.
- Breadcrumbs for every routed screen.
- Command Palette foundation for search and governed future action discovery.

Hover explains context. It must not perform navigation. Command execution remains disabled until governed write APIs, permissions, persistence, and audit controls are implemented.

The Portfolio Mode asset viewer is registered as `EOS-ASSET-EXPLORER` and coordinated by `EOS-WF-KNOWLEDGE-ASSET-VIEWER`.

## EOS PMO And Master Roadmap

EOS PMO owns strategic program management and roadmap governance.

PMO endpoints:

- `GET /api/pmo`
- `GET /api/pmo/master-roadmap`

The Master Roadmap is a Live Enterprise Object, not a static document. It must include vision, mission, strategic objectives, programs, phases, milestones, capabilities, dependencies, risks, executive owner, business value, research value, investor value, estimated completion, status, progress, health, recommended action, available actions, and `liveStatus`.

Each roadmap program must include objectives, milestones, capabilities, progress, dependencies, executive owner, and business impact. Each roadmap capability must reference program, phase, milestone, owner, business impact, research impact, investor impact, related Enterprise Objects, and related Knowledge Objects.

## Enterprise Strategy, Valuation & Governance

EOS Strategy endpoints:

- `GET /api/strategy`
- `GET /api/governance`
- `GET /api/valuation`
- `GET /api/second-balance-sheet`
- `GET /api/digital-twin-assets`
- `GET /api/digital-twin-assets/:id`
- `GET /api/strategic-layer`

Strategy, governance, valuation, Second Balance Sheet, DTA monitoring, and Digital Twin Asset records are persisted through the Persistent Data Store.

Every major Master Roadmap program must include:

- strategicObjective
- businessPlanAlignment
- governanceApprovalStatus
- investorRelevance
- enterpriseValueContribution
- secondBalanceSheetImpact

Digital enterprise valuation values must remain clearly marked as internal estimates only. They are not financial advice and are not audited valuation.

## Enterprise Digital Twin Visual Layer

EOS visual intelligence capabilities expose onboarded enterprises as Digital Twin Asset visual models.

Visual endpoints:

- `GET /api/master-monitoring`
- `GET /api/enterprise-visuals`
- `GET /api/enterprise-visuals/:id`
- `GET /api/enterprise-telemetry`
- `GET /api/enterprise-telemetry/:enterpriseId`
- `GET /api/digital-twin-home/:enterpriseId`

Persistent collections:

- `master-monitoring`
- `enterprise-visuals`
- `enterprise-telemetry`
- `digital-twin-homes`
- `digital-twin-generation-workflows`
- `enterprise-architecture-layers`

Visual intelligence models must keep seeded/simulated data clearly separate from live external feeds. Until a future integration capability is approved, telemetry is local and simulated.

Timestamp standard:

- Store timestamps as UTC.
- Include `displayTimezone`.
- Display local enterprise/user time where practical.
- Label timezone context in Mission Control.

## Investment Thesis Alignment

EOS strategic narrative records are operational platform data, not static slides. The Strategic Alignment endpoint is:

- `GET /api/strategic-alignment`

Strategic alignment records should connect the investment thesis, Technology Flywheel, Three-Horizon Roadmap, Revenue Engine, DTA Lifecycle, KIPR, ePercent Enterprise Profile, Industry Framework, and readiness assessments to Enterprise Objects, workflows, events, PMO programs, DTAs, and knowledge assets.

When source strategy presentations are available, they should be indexed into KIPR and reconciled against:

- implemented platform concepts
- partially implemented concepts
- not-yet-implemented concepts
- recommended future capabilities

Commercial, investor, and research readiness should be reported as explicit scores with assumptions and next steps.

## Executive Council And Digital Enterprise Headquarters

EOS Executive Council defines the visible leadership model for the AI-native enterprise and the first Digital Enterprise Headquarters surface in Mission Control.

Executive Council endpoints:

- `GET /api/executive-council`
- `GET /api/executive-council/:id`

Each executive profile must include identity, role, type, department, reporting line, responsibilities, current focus, lifecycle status, health, progress, attention state, summary, recommended action, available actions, linked Enterprise Objects, linked programs, and last activity.

The CEO cockpit must summarize platform version, platform health, current sprint, current capability, executive attention required, top recommended action, active executives, and current roadmap phase.

## Executive Action & Approval Framework

EOS Executive Action Framework records and governs executive actions before real execution exists.

Executive Action endpoints:

- `GET /api/executive-actions`
- `GET /api/executive-actions/:id`
- `GET /api/executive-actions/pending-approval`

Each Executive Action must include id, label, description, owner, requester, target object, target type, source executive, status, approval requirement, approval status, risk level, timestamps, linked workflow, linked events, audit trail, available decision actions, recommended next step, and non-execution metadata.

Valid action statuses are Draft, Pending Review, Awaiting Approval, Approved, Rejected, Deferred, Cancelled, and Completed.

Valid approval statuses are Not Required, Pending, Approved, Rejected, and Escalated.

Valid risk levels are Low, Medium, High, and Critical.

Mission Control may display executive actions, approval queues, risk summaries, and audit state. It must not execute, send, schedule, trigger, or integrate with external systems until a future permissioned execution capability is approved.

## Executive Office Framework

EOS Executive Office Framework turns the Executive Council into a gateway for detailed executive workspaces.

Executive Office endpoints:

- `GET /api/executive-offices`
- `GET /api/executive-offices/:id`

Every Executive Office must include executive identity, department, status, health, current focus, executive briefing, today's summary, current priorities, CEO attention items, recommended actions, estimated CEO review time, department health, KPIs, current projects, capabilities, programs, live Enterprise Objects, knowledge assets, workflows, recent events, activity timeline, department portfolio, approvals waiting, placeholders for messages, meetings, calendar and temporary agents, permanent agents, and available actions.

Office actions may open local EOS records. Assign Task and Request Review remain display-only. Schedule Meeting and Message Executive remain placeholders until explicit future capabilities implement them.

## Automation

Root scripts are the primary developer entrypoint:

- `npm run eos:start`
- `npm run eos:stop`
- `npm run eos:status`
- `npm run eos:test`
- `npm run eos:build`
- `npm run eos:lint`
- `npm run eos:backup`
- `npm run eos:restore`
- `npm run eos:git:status`
- `npm run eos:release`
- `npm run eos:tag`

## Backup And Recovery

Use:

```bash
npm run eos:backup
```

The backup command creates a timestamped archive in `backups/`, records metadata in `backups/backup-log.json`, and updates `backups/backup-status.json`.

Backups must include `data/` so persistent storage can be restored. Backup status metadata reports `latestBackupDataIncluded` for verification.

Validate backup status metadata:

```bash
npm run eos:backup:status
```

Use:

```bash
npm run eos:restore
```

The restore command lists backups by default. Use `--latest` or `--archive <archive-name>` to validate a backup, and add `--confirm` to restore files.

## Google Drive Backup Preparation

Use:

```bash
npm run eos:drive:status
npm run eos:drive:test
```

These commands validate local configuration only. They do not authenticate, connect to Google Drive, create folders, upload files, or synchronize data.

Configuration files:

- `config/google-drive.example.json` contains placeholder Google Drive configuration fields.
- `config/backup-sync.json` defines the local backup synchronization policy.

Future credential files such as `config/google-drive.json` must remain ignored and must not be committed.

## Source Control And Release Management

Use:

```bash
npm run eos:git:status
```

This reports the current branch, latest commit, uncommitted changes, current EOS version, and latest tag.

Use:

```bash
npm run eos:release
```

This runs lint, build, test, backup, updates `docs/releases/RELEASE-MANIFEST.json`, writes release notes, and prepares the workspace for commit.

Use:

```bash
npm run eos:tag
```

This creates a local semantic version tag for the current EOS version after a release commit exists. It prevents duplicate tags and does not push to GitHub.

## Enterprise Design System

Mission Control uses the EOS Enterprise Design System for executive-grade UI quality.

Reference documents:

- `docs/architecture/EOS-Enterprise-Design-System.md`
- `docs/architecture/EOS-UX-Guidelines.md`
- `docs/architecture/EOS-UX-Audit-Report-EOS-CAP-0024.md`
- `docs/architecture/EOS-Mission-Control-Navigation.md`
- `docs/architecture/EOS-Digital-Enterprise-Headquarters-UX.md`
- `docs/architecture/EOS-Navigation-UX-Audit-EOS-CAP-0028.md`

Frontend standards:

- Use executive language, not developer placeholder language.
- Use meaningful status terms such as Operational, Monitoring, Pending Assessment, No Action Required, and Requires Attention.
- Add hover intelligence for important executive concepts.
- Preserve keyboard focus states and responsive layout behavior.
- Keep Presentation Mode investor-ready and low clutter.

Capability completion now requires seven quality gates for strategy-facing work:

1. Engineering Gate
2. Architecture Gate
3. UX/UI Gate
4. Executive Gate
5. Investor Gate
6. Commercial Gate
7. Research Gate

## AI Workforce Operations And Platform Administration

Mission Control now includes workspace navigation, context navigation, and operating views for Platform Administration and AI Workforce Operations.

Backend APIs:

- `GET /api/platform`
- `GET /api/platform/status`
- `GET /api/platform/admin`
- `GET /api/platform/navigation`
- `GET /api/admin-actions`
- `GET /api/agent-messages`
- `GET /api/agent-activity`
- `GET /api/agent-attention`
- `GET /api/agent-calendar`

Development rules:

- Safe administration actions may be displayed as executable only when they are read-only or resilience-oriented.
- Destructive administration actions must be represented as governed display-only actions until authorization, persistent audit, restore validation, and rollback controls are implemented.
- Agent communications are local internal records until a future connector capability is approved.
- Agent calendar events are local records until external calendar synchronization is approved.
- Every new operating model must persist through the local storage foundation and include automated endpoint verification.

## GitHub Readiness

EOS does not create GitHub repositories, add remotes, push code, or authenticate with GitHub until readiness has been reviewed and explicitly approved.

The GitHub readiness report lives at `docs/releases/EOS-GitHub-Readiness-Report.md` and includes repository health, branch strategy, organization structure, protection rules, release strategy, tagging strategy, labels, milestones, project board structure, backup compatibility, and the EOS GitHub Readiness Checklist.

## Alpha Genesis Baseline

EOS Alpha 0.7.0 Genesis is the first official source control baseline. It records the initial engineering foundation, local release tag target, capabilities, Enterprise Objects, agents, Knowledge Objects, workflows, events, known limitations, and next release objectives in `docs/releases/EOS-Alpha-0.7.0-Genesis.md`.
