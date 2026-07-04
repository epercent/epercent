# EOS

EOS is an AI-native Enterprise Operating System workspace with:

- EOS Core API backend in `backend/`
- Mission Control frontend in `frontend/`
- Workspace automation in `scripts/`
- Future service and app migration targets in `services/` and `apps/`
- Architecture, genesis, and capability documentation in `docs/`

## Engineering Agent

- Agent: Codex
- Agent ID: EOS-AGENT-CODEX
- Role: Chief Engineering Officer
- Reporting To: Chief Technology Officer

Codex is the EOS Engineering Department agent. Athena is the Chief Research Officer, Hermes is the Chief Knowledge Officer, and Atlas is the Chief Enterprise Architect.

## Executive Leadership Team

EOS executive agents are organizational roles only. They do not add AI functionality.

- Codex: Chief Engineering Officer
- Hermes: Chief Knowledge Officer
- Athena: Chief Research Officer
- Atlas: Chief Enterprise Architect
- Mercury: Chief Opportunity Officer
- Argus: Chief Operations Officer
- Vulcan: Chief Quality Officer

Every executive agent reports to the Chief Technology Officer.

## Start EOS

From the repository root:

```bash
npm run eos:start
```

This starts:

- EOS Core API: `http://127.0.0.1:3000`
- Mission Control: `http://127.0.0.1:5173`

## Stop EOS

```bash
npm run eos:stop
```

## Check Status

```bash
npm run eos:status
```

The status command verifies:

- Backend running
- Frontend running
- API responding
- Mission Control reachable
- Storage health
- Persistent collection counts
- Backup status and persistent data inclusion
- Platform Administration status
- Governed admin action counts
- AI Workforce messages, activity, attention, and calendar counts
- Platform audit status and Alpha, Beta, and Version 1.0 readiness scores
- Mission Control workspace navigation readiness
- Strategic alignment, investment thesis, revenue engine, and KIPR readiness
- Startup experience, identity media, organization intake, and external repository link readiness

## Test And Build

```bash
npm run eos:test
npm run eos:build
npm run eos:lint
```

## Platform Audit

Generate the EOS Platform Audit and Capability Readiness report:

```bash
npm run eos:audit
```

Audit API endpoint:

- `GET /api/audit`

Mission Control displays Platform / Audit with capability readiness, API coverage, frontend route coverage, persistence health, placeholder and display-only items, technical debt, release maturity scoring, quality gates, and the recommended build sequence.

## Backup And Restore

Create a versioned backup:

```bash
npm run eos:backup
```

List available backups:

```bash
npm run eos:restore
```

Validate the latest backup:

```bash
npm run eos:restore -- --latest
```

Restore the latest backup:

```bash
npm run eos:restore -- --latest --confirm
```

## Google Drive Backup Preparation

Validate local Google Drive backup readiness without authenticating, creating folders, uploading files, or synchronizing data:

```bash
npm run eos:drive:status
npm run eos:drive:test
```

The credential-free template is `config/google-drive.example.json`. Future real credential files such as `config/google-drive.json` are ignored by Git.

## Live Object Status

Enterprise Objects returned by EOS Core API include `liveStatus` with status color, operational status, lifecycle status, health score, progress, attention level, recommended action, and available actions.

Mission Control displays this live status so the registry can operate as an action console instead of a static object list.

Executive-facing status language uses meaningful values such as `No Action Required`, `Pending Assessment`, `Draft`, `Idea`, `In Progress`, `Review`, and `Verified`.

## Agent Knowledge Repository

EOS provides an Agent Knowledge Repository for executive-agent research, publications, reports, intellectual property, and operational knowledge.

API endpoints:

- `GET /api/knowledge-repositories`
- `GET /api/knowledge-repositories/:agent`
- `GET /api/knowledge-objects`
- `GET /api/knowledge-objects/:id`

Mission Control displays repository ownership, research projects, publication readiness, investor readiness, patent opportunities, recent activity, and attention level.

## Mission Control Knowledge Asset Viewer

Mission Control now supports:

- CEO Cockpit for executive platform status, top action, office readiness, approvals, and roadmap context.
- Executive Council for leadership overview and office entry.
- Executive Offices for department-level briefings, KPIs, portfolios, approvals, knowledge, workflows, and placeholders.
- Programs and Roadmap for PMO governance.
- Assets for live Enterprise Objects.
- Knowledge for Live Knowledge Objects and research assets.

Seeded Athena research projects include preview sections for executive summary, core argument, research questions, commercial relevance, related EOS capability, and next drafting step.

## EOS PMO And Master Roadmap

EOS provides a Program Management Office and Master Roadmap as live platform objects rather than static documents.

API endpoints:

- `GET /api/pmo`
- `GET /api/pmo/master-roadmap`

The Master Roadmap tracks vision, mission, strategic objectives, programs, phases, milestones, capabilities, dependencies, risks, executive owner, business value, research value, investor value, estimated completion, status, progress, health, recommended action, and available actions.

## Enterprise Strategy, Valuation & Governance

EOS provides a Strategic Layer / CEO Value View that aligns roadmap execution with enterprise strategy, governance approval, Digital Twin Asset formation, Second Balance Sheet metrics, and internal valuation assumptions.

API endpoints:

- `GET /api/strategy`
- `GET /api/governance`
- `GET /api/valuation`
- `GET /api/second-balance-sheet`
- `GET /api/digital-twin-assets`
- `GET /api/digital-twin-assets/:id`
- `GET /api/strategic-layer`

Mission Control displays enterprise strategy, governance approval status, roadmap alignment, internal digital enterprise valuation, Second Balance Sheet metrics, DTA counts, value drivers, governance attention items, and investor readiness notes.

Valuation values are internal estimates only. They are not financial advice and are not audited valuation.

## Master Monitoring & Enterprise Digital Twin Visuals

EOS now includes a visual intelligence layer for Digital Twin Assets and onboarded enterprises.

API endpoints:

- `GET /api/master-monitoring`
- `GET /api/enterprise-visuals`
- `GET /api/enterprise-visuals/:id`
- `GET /api/enterprise-telemetry`
- `GET /api/enterprise-telemetry/:enterpriseId`
- `GET /api/digital-twin-home/:enterpriseId`

Mission Control displays Master Monitoring, Onboarded Enterprises, Enterprise Home, Digital Twin Structure, Data Feeds, Systems, Assets, and Human Workflows under Enterprise Value.

The Master Monitoring color system is now the default Mission Control executive theme. Mission Control opens with Enterprise Value first because EOS is organized around value creation, Digital Twin Assets, valuation, Second Balance Sheet evidence, and investor readiness.

Master Monitoring keeps the onboarded enterprise count in its headline summary while detailed enterprise and organization portfolio review happens in the dedicated Onboarded Enterprises view.

The current visual layer uses local seeded models and simulated telemetry. It does not connect real-time external feeds, generate digital twins from uploaded documents, or use a real 3D rendering engine yet.

Timestamp standard: store timestamps as UTC, include `displayTimezone`, and show local enterprise display time where relevant.

## Identity, Startup Experience & Organization Intake

EOS now supports a modern Mission Control startup experience, human executive profile pictures, built-in functional avatars for agents, company and organization logos, organization file intake, and external repository links for cloud-scale source material.

API endpoints:

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

Mission Control displays Startup Experience, Identity Media, Organization Intake, and Repository Links under Platform.

Small files can be stored locally under `data/repository`. Large organization repositories, governed cloud-drive folders, media libraries, and source archives should be registered as external repository links until cloud sync, permissions, and audit controls are implemented.

## Enterprise Onboarding & DTA Assimilation

EOS now includes the first structured enterprise onboarding and Digital Twin Asset assimilation framework. The framework can represent enterprise intake, source classification, known assets, Digital Mirrors, DTA candidates, required data feeds, assigned agents, and human validation gates without connecting external data sources or running AI extraction.

API endpoints:

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

Mission Control displays Onboarded Enterprises, Enterprise Onboarding, Assimilation Pipeline, Digital Mirrors, DTA Candidates, Feed Requirements, and Human Validation under Enterprise Value.

## Investment Thesis Alignment

EOS now exposes the investment thesis as a live strategic alignment layer. Mission Control can display the EOS investment thesis, Technology Flywheel, Three-Horizon Roadmap, Revenue Engine, Digital Twin Asset Lifecycle, KIPR, ePercent Enterprise Profile, Cross Industry Framework, and readiness assessments.

API endpoint:

- `GET /api/strategic-alignment`

The alignment layer maps the platform to investor-facing concepts including Enterprise Objects, Digital Twin Assets, the Second Balance Sheet, AI Workforce, DTAP, DTAM, DTAX, KIPR, the Technology Flywheel, and the Three-Horizon Roadmap.

Source presentation files were not found in the repository during CAP-0029, so the current alignment is based on existing EOS strategy records and the approved capability brief. Future uploads of the source decks should be indexed into KIPR and reconciled against this alignment model.

## AI Workforce Operations & Platform Administration

EOS provides a Mission Control operating layer for platform administration and AI workforce oversight.

API endpoints:

- `GET /api/platform`
- `GET /api/platform/status`
- `GET /api/platform/admin`
- `GET /api/platform/navigation`
- `GET /api/admin-actions`
- `GET /api/admin-actions/:id`
- `GET /api/agent-messages`
- `GET /api/agent-messages/:id`
- `GET /api/agent-messages/threads/:threadId`
- `GET /api/agent-activity`
- `GET /api/agent-attention`
- `GET /api/agent-calendar`

Mission Control now uses a Digital Headquarters navigation model: Executive Command Bar, Digital Headquarters Lobby, Primary Workspace Rail, context navigation, breadcrumbs, and command palette foundation.

Platform Administration displays platform status, version, environment, backend, frontend, API health, storage health, backup health, latest backup, restore validation, release version, Git status, registered services, active APIs, running URLs, warnings, and recommended admin actions.

Governed actions such as stopping, restarting, restoring, upgrading, cloning environments, and scaling workers are display-only. Execution remains disabled until permissions, persistence, and audit controls are implemented.

## Mission Control Navigation & Digital Headquarters

Mission Control opens into the Enterprise Value workspace rather than a long menu. Enterprise Value opens Master Monitoring by default and leads with value, Digital Twin Assets, telemetry, governance, and human approval points. The Digital Headquarters Lobby remains available as a routed workspace-selection view.

- Enterprise Value
- Headquarters
- Enterprise
- AI Workforce
- Knowledge
- Platform
- Development
- My Workspace

The Executive Command Bar remains visible with platform identity, current workspace, Enterprise Value, Platform Health, Digital Twin Assets, AI Workforce, Knowledge Assets, attention indicator, command/search foundation, and Presentation Mode.

Hover explains. Click navigates.

Command palette execution is disabled until governed write APIs, permissions, persistence, and audit controls are implemented.

## Executive Council And Digital Enterprise Headquarters

EOS provides an Executive Council model and the first Digital Enterprise Headquarters surface in Mission Control.

API endpoints:

- `GET /api/executive-council`
- `GET /api/executive-council/:id`

The Executive Council includes Eric Olo, ChatGPT, Codex, Athena, Hermes, Atlas, Mercury, Argus, and Vulcan. Mission Control displays the CEO cockpit, executive status, role, department, current focus, health score, attention level, recommended action, and available actions. Actions are visible but not executable yet.

## Executive Action & Approval Framework

EOS provides a governed executive action registry and approval queue. The framework records actions, approval status, risk, recommended next step, linked workflow, linked events, and audit trail metadata.

API endpoints:

- `GET /api/executive-actions`
- `GET /api/executive-actions/:id`
- `GET /api/executive-actions/pending-approval`

Action governance is active. Execution is disabled until permissions, persistence, and audit controls are implemented.

## Executive Office Framework

EOS provides reusable Executive Offices for every Executive Council member.

API endpoints:

- `GET /api/executive-offices`
- `GET /api/executive-offices/:id`

Each office includes executive briefing, today's summary, current priorities, CEO attention items, recommended actions, estimated CEO review time, department health, KPIs, projects, capabilities, programs, live Enterprise Objects, knowledge assets, workflows, recent events, activity timeline, portfolio, approvals, placeholders for messages/meetings/calendar/temporary agents, permanent agents, and available actions.

Messages, meetings, calendar, temporary agents, and task assignment remain placeholders or display-only.

## EOS Enterprise Design System

EOS Mission Control now follows the first Enterprise Design System.

Design documentation:

- `docs/architecture/EOS-Enterprise-Design-System.md`
- `docs/architecture/EOS-UX-Guidelines.md`
- `docs/architecture/EOS-UX-Audit-Report-EOS-CAP-0024.md`
- `docs/architecture/EOS-Mission-Control-Navigation.md`
- `docs/architecture/EOS-Digital-Enterprise-Headquarters-UX.md`
- `docs/architecture/EOS-Navigation-UX-Audit-EOS-CAP-0028.md`

Mission Control includes:

- Executive language standards.
- Keyboard-accessible hover intelligence.
- Presentation Mode for boardroom and investor demonstrations.
- Executive Command Bar, Workspace Rail, Digital Headquarters Lobby, Context Navigation, Breadcrumbs, and Command Palette foundation.
- Executive briefing hierarchy for office screens.
- Outcome-oriented action labels.
- UX audit scoring across current Mission Control views.

Every future capability must pass five quality gates before completion:

1. Engineering Gate
2. Architecture Gate
3. UX/UI Gate
4. Executive Gate
5. Investor Gate

## Persistent Data Store

EOS Core API now initializes a local durable JSON persistence layer while preserving existing APIs and seed fallback behavior.

Storage directories:

- `data/store/` for persisted collection envelopes
- `data/snapshots/` for storage snapshots
- `data/schema/` for storage schema documentation

API endpoints:

- `GET /api/storage/status`
- `GET /api/storage/collections`
- `GET /api/storage/collections/:name`

Mission Control displays Storage / Data Health including storage status, collection count, record count, last update, snapshots, and warnings.

Backups include `data/` and report whether persistent data was included in backup metadata.

## Source Control And Releases

Inspect Git and version status:

```bash
npm run eos:git:status
```

Prepare a release:

```bash
npm run eos:release
```

Create a local semantic version tag after a release commit exists:

```bash
npm run eos:tag
```

Release artifacts live in `docs/releases/`. EOS release automation does not push to GitHub.

## GitHub Readiness

EOS GitHub integration is intentionally gated. The readiness assessment is documented in `docs/releases/EOS-GitHub-Readiness-Report.md`.

Before adding a remote or pushing code, complete the EOS GitHub Readiness Checklist and receive explicit approval.

## Alpha Genesis Baseline

The first official local source control baseline is documented in `docs/releases/EOS-Alpha-0.7.0-Genesis.md`. The local tag target is `v0.7.0`.

## Bootstrap A New Machine

```bash
./bootstrap.sh
```

Bootstrap initializes Git when needed and installs backend and frontend dependencies.

## Workspace Structure

- `backend/` current EOS Core API
- `frontend/` current Mission Control app
- `services/` future backend services
- `apps/` future EOS applications
- `agents/` agent definitions and runtime assets
- `docs/` architecture, genesis, and capability documentation
- `tests/` workspace-level tests
- `scripts/` developer automation
- `infrastructure/` deployment and environment configuration
