# Changelog

## 0.25.0 - 2026-07-04

- Added EOS-CAP-0033: Platform Audit & Capability Readiness Center.
- Added `GET /api/audit`.
- Added `npm run eos:audit` to generate `docs/audits/EOS-Platform-Audit-v0.25.0.json`.
- Added Mission Control Platform / Audit view with capability readiness, API coverage, frontend route coverage, persistence health, placeholder register, technical debt, readiness scoring, quality gates, and recommended build sequence.
- Registered audit Enterprise Objects, `EOS-WF-PLATFORM-AUDIT-READINESS`, and audit EOS Events.
- Updated PMO and CEO Cockpit current capability to EOS-CAP-0033.
- Extended automated verification for the audit endpoint, audit route, audit script, Enterprise Objects, workflow, and events.
- Updated EOS Core API status version to `0.25.0`.

## 0.24.1 - 2026-07-04

- Added a dedicated Mission Control `Onboarded Enterprises` view under Enterprise Value.
- Moved detailed onboarded enterprise and organization portfolio review out of Master Monitoring.
- Preserved the Master Monitoring `Onboarded Enterprises` count in the headline summary metrics.
- Added enterprise portfolio metrics for onboarding records, visual homes, DTA candidates, feed requirements, validation items, and attention required.
- Updated Enterprise Value navigation and platform navigation metadata.
- Updated EOS Core API status version to `0.24.1`.

## 0.24.0 - 2026-07-04

- Added EOS-CAP-0032: Enterprise Onboarding & DTA Assimilation Engine.
- Added enterprise onboarding APIs: `GET /api/onboarding`, `GET /api/onboarding/:id`, and `GET /api/onboarding/:id/pipeline`.
- Added Digital Mirror, DTA Candidate, Data Feed Requirement, Human Validation, and Onboarding Assimilation overview APIs.
- Seeded Example Oil & Gas Enterprise, ePercent, and EOS Platform onboarding records.
- Seeded Oil & Gas DTA candidates for Offshore Rig, Pipeline Network, Production Operations, Storage Facility, and Enterprise Headquarters.
- Added persistent collections for enterprise onboarding, assimilation pipelines, digital mirrors, DTA candidates, data feed requirements, and human validation items.
- Added Mission Control views for Enterprise Onboarding, Assimilation Pipeline, Digital Mirrors, DTA Candidates, Feed Requirements, and Human Validation.
- Linked Digital Mirrors and DTA candidates from Enterprise Digital Twin Home cards.
- Registered CAP-0032 Enterprise Objects, workflows, and EOS Events.
- Extended automated verification for all new endpoints, storage collections, Enterprise Objects, workflows, and event records.
- Updated EOS Core API status version to `0.24.0`.

## 0.23.0 - 2026-07-03

- Added EOS-CAP-0031: Identity, Startup Experience & Organization Intake Foundation.
- Added EOS startup experience and Platform routes for Startup Experience, Identity Media, Organization Intake, and Repository Links.
- Added profile identities for human, advisor, agent, and organization profiles with avatar/logo metadata.
- Added local media asset registry, organization intake registry, extraction rules, and external repository link records.
- Added identity/intake API endpoints for startup, profiles, assets, uploads, organization imports, and repository links.
- Registered CAP-0031 Enterprise Objects, workflow, and EOS Events.
- Added persistent collections for startup experience, profile identities, media assets, organization intake records, repository links, and extraction rules.
- Extended automated verification for the new API endpoints, storage collections, workflow, events, profile media, repository link creation, and organization import extraction.
- Updated EOS Core API status version to `0.23.0`.

## 0.22.0 - 2026-07-03

- Added EOS-CAP-0030: Enterprise Digital Twin Visual Layer & Master Monitoring View.
- Added Master Monitoring API: `GET /api/master-monitoring`.
- Added enterprise visual APIs: `GET /api/enterprise-visuals`, `GET /api/enterprise-visuals/:id`, `GET /api/enterprise-telemetry`, `GET /api/enterprise-telemetry/:enterpriseId`, and `GET /api/digital-twin-home/:enterpriseId`.
- Added persistent visual intelligence collections for master monitoring, enterprise visuals, enterprise telemetry, digital twin homes, digital twin generation workflows, and enterprise architecture layers.
- Seeded `DTA-OIL-001` as an Oil & Gas demonstration Digital Twin Asset.
- Added Mission Control dark premium Master Monitoring view, layered enterprise architecture diagram, enterprise digital twin homes, simulated telemetry display, systems/assets views, and human workflow views.
- Applied the Master Monitoring dark executive color system across Mission Control.
- Made Enterprise Value the first workspace and default entry point, opening Master Monitoring by default while preserving the Digital Headquarters Lobby route.
- Added avatar and visual identity fields to agent and executive profile models.
- Registered CAP-0030 Enterprise Objects and `EOS-WF-ENTERPRISE-DIGITAL-TWIN-VISUALIZATION`.
- Added events for Master Monitoring creation, visual model creation, digital twin home creation, telemetry updates, timezone standard application, and digital twin structure generation.
- Updated PMO Master Roadmap, CEO Cockpit, DTA monitoring, Second Balance Sheet counts, platform navigation, release metadata, architecture docs, and automated verification.
- Updated EOS Core API status version to `0.22.0`.

## 0.21.0 - 2026-07-03

- Added EOS-CAP-0029: Investment Thesis Alignment & Strategic Narrative Integration.
- Added Strategic Alignment API endpoint: `GET /api/strategic-alignment`.
- Added investment thesis alignment data for implemented, partial, not-yet-implemented, and recommended future capabilities.
- Added EOS Technology Flywheel, Three-Horizon Roadmap, Revenue Engine, Digital Twin Asset Lifecycle, KIPR, ePercent Enterprise Profile, and Cross Industry Framework records.
- Added Mission Control strategic views for Investment Thesis, Technology Flywheel, Three-Horizon Roadmap, Revenue Engine, DTA Lifecycle, KIPR, Enterprise Profile, Industry Framework, Investor Readiness, and Commercial Readiness.
- Updated Mission Control navigation to expose strategic narrative and commercialization routes across Enterprise, Enterprise Value, Knowledge, and Development workspaces.
- Registered CAP-0029 strategic Enterprise Objects and `EOS-WF-STRATEGIC-ALIGNMENT`.
- Added investment thesis, flywheel, revenue, DTA lifecycle, KIPR, and enterprise profile EOS Events.
- Persisted strategic alignment data through the Persistent Data Store.
- Updated PMO Master Roadmap, CEO Cockpit, Digital Twin Asset lifecycle metadata, release metadata, strategy docs, and automated verification.
- Updated EOS Core API status version to `0.21.0`.

## 0.20.0 - 2026-07-03

- Added EOS-CAP-0028: Mission Control Navigation & Frontend Experience Redesign.
- Replaced the long Mission Control left navigation with a Digital Headquarters navigation model.
- Added Executive Command Bar, Digital Headquarters Lobby, Primary Workspace Rail, context navigation, breadcrumbs, command palette foundation, workspace tiles, metric pills, and attention indicators.
- Added Knowledge context routes for White Papers, Academic Papers, Patents, and Publications.
- Added My Workspace context routes for Briefing, Tasks, Decisions, and Notes.
- Updated `/api/platform/navigation` to report CAP-0028 and include the new context routes.
- Registered `EOS-MISSION-CONTROL-NAVIGATION`, `EOS-DIGITAL-HEADQUARTERS-LOBBY`, `EOS-COMMAND-PALETTE`, and `EOS-WORKSPACE-RAIL` as Enterprise Objects.
- Registered `EOS-WF-MISSION-CONTROL-EXPERIENCE-GOVERNANCE`.
- Added Mission Control navigation redesign, lobby, workspace rail, command palette, and UX navigation audit EOS Events.
- Updated PMO Master Roadmap, CEO Cockpit, release metadata, architecture docs, UX guidelines, and automated verification.
- Updated EOS Core API status version to `0.20.0`.

## 0.19.0 - 2026-07-03

- Added EOS-CAP-0027: AI Workforce Operations & Platform Administration Center.
- Added platform APIs: `GET /api/platform`, `GET /api/platform/status`, `GET /api/platform/admin`, and `GET /api/platform/navigation`.
- Added admin action APIs: `GET /api/admin-actions` and `GET /api/admin-actions/:id`.
- Added AI Workforce APIs for messages, message lookup, message threads, activity, attention queue, and calendar.
- Added persistent Mission Control left navigation across Headquarters, Enterprise, Enterprise Value, AI Workforce, Knowledge, Platform, Development, and My Workspace.
- Added CEO Cockpit headline metrics for enterprise value, Digital Twin Assets, AI Workforce, enterprise health, knowledge assets, and current priority.
- Added Platform Administration Center in Mission Control with platform health, backup health, restore validation, release, Git, services, APIs, URLs, warnings, and recommended actions.
- Added local agent communications, agent activity, agent attention queue, and agent calendar foundations.
- Added authorization policies and action governance records for governed non-destructive display of risky administration actions.
- Registered CAP-0027 Enterprise Objects and workflows.
- Added CAP-0027 EOS Events for platform administration, admin actions, agent messages, activity, attention, calendar, and action governance policy creation.
- Persisted platform operations, navigation, admin actions, authorization policies, action governance, agent messages, activity, attention, and calendar records.
- Added architecture documentation for AI Workforce Operations, Platform Administration Center, and Action Governance.
- Updated EOS Core API status version to `0.19.0`.
- Extended automated verification for all new endpoints, storage collections, Enterprise Objects, workflows, events, and non-execution safety.

## 0.18.0 - 2026-07-03

- Added EOS-CAP-0026: Enterprise Strategy, Valuation & Governance Alignment Layer.
- Added Enterprise Strategy, Governance Council, Digital Enterprise Valuation, Second Balance Sheet, DTA Monitoring, and Digital Twin Asset seed records.
- Added Strategy API endpoints: `GET /api/strategy`, `GET /api/governance`, `GET /api/valuation`, `GET /api/second-balance-sheet`, `GET /api/digital-twin-assets`, `GET /api/digital-twin-assets/:id`, and `GET /api/strategic-layer`.
- Seeded `DTA-EPERCENT-001` and `DTA-EOS-001`.
- Added Mission Control Strategic Layer / CEO Value View.
- Added roadmap alignment fields for every major Master Roadmap program.
- Registered `EOS-ENTERPRISE-STRATEGY`, `EOS-GOVERNANCE-COUNCIL`, `EOS-DIGITAL-ENTERPRISE-VALUATION`, `EOS-SECOND-BALANCE-SHEET`, `EOS-DTA-MONITORING`, Digital Twin Assets, and `EOS-WF-STRATEGY-GOVERNANCE-VALUATION` as Enterprise Objects.
- Added strategy, governance, valuation, Second Balance Sheet, and DTA EOS Events.
- Persisted strategy-layer records through the Persistent Data Store.
- Added architecture documentation for the Enterprise Strategy Layer, Second Balance Sheet Metrics, and Digital Enterprise Valuation.
- Updated EOS Core API status version to `0.18.0`.
- Extended automated verification for strategy endpoints, DTA lookup, persistent collections, roadmap alignment, workflow lookup, and event lookup.

## 0.17.0 - 2026-07-03

- Added EOS-CAP-0025: Persistent Data Store Foundation.
- Added local JSON persistence directories under `data/store/`, `data/snapshots/`, and `data/schema/`.
- Added reusable backend storage service with collection reads, writes, updates, lookup, listing, snapshots, bootstrap fallback, and health reporting.
- Added startup bootstrap from seeded registries without duplicate record creation.
- Updated Enterprise Objects, agents, knowledge, workflows, events, PMO, Executive Council, Executive Actions, Executive Offices, Agent Knowledge Repositories, backup status, and release metadata to initialize into persistent collections.
- Added Storage API endpoints: `GET /api/storage/status`, `GET /api/storage/collections`, and `GET /api/storage/collections/:name`.
- Added Mission Control Storage / Data Health panel.
- Registered `EOS-PERSISTENT-DATA-STORE`, `EOS-STORAGE-HEALTH`, and `EOS-WF-PERSISTENT-DATA-MANAGEMENT` as Enterprise Objects.
- Added storage events for persistent store creation, collection initialization, collection updates, storage snapshots, and health checks.
- Updated backup metadata to report whether `data/` was included in backups.
- Added persistent storage architecture documentation and PostgreSQL migration path.
- Updated EOS Core API status version to `0.17.0`.
- Extended automated verification for storage endpoints, storage collections, storage objects, workflow lookup, and event lookup.

## 0.16.0 - 2026-07-03

- Added EOS-CAP-0024: EOS Enterprise Design System, UX Audit & Executive Presentation Framework.
- Added Enterprise Design System utilities for executive language, hover intelligence, action label refinement, and status fallbacks.
- Added Mission Control Presentation Mode for boardroom-ready views.
- Added keyboard-accessible hover tooltips for important executive concepts.
- Improved CEO Cockpit, Executive Council, Executive Offices, Knowledge, Roadmap, Programs, Portfolio, and Assets screens.
- Replaced generic executive action labels with outcome-oriented executive language.
- Registered `EOS-ENTERPRISE-DESIGN-SYSTEM`, `EOS-EXECUTIVE-PRESENTATION-MODE`, `EOS-UX-AUDIT`, and `EOS-WF-DESIGN-GOVERNANCE` as Enterprise Objects.
- Added design governance events for design-system creation, UX audit completion, presentation mode, tooltip registration, and design standard updates.
- Added UX Audit Report and UX Guidelines.
- Added five mandatory quality gates for all future capabilities: Engineering, Architecture, UX/UI, Executive, and Investor.
- Updated EOS Core API status version to `0.16.0`.
- Extended automated verification for design objects, workflow lookup, event lookup, current capability, and executive action language.

## 0.15.0 - 2026-07-03

- Added EOS-CAP-0023: Executive Office Framework.
- Added Executive Office APIs: `GET /api/executive-offices` and `GET /api/executive-offices/:id`.
- Added reusable Executive Office records for Eric Olo, ChatGPT, Codex, Athena, Hermes, Atlas, Mercury, Argus, and Vulcan.
- Added CEO Cockpit, Executive Council, Executive Offices, Programs, Assets, Knowledge, and Roadmap navigation in Mission Control.
- Added Executive Office pages with briefings, priorities, CEO attention items, KPIs, projects, capabilities, programs, Enterprise Objects, knowledge assets, workflows, recent events, activity timeline, portfolio, approvals, placeholders, and actions.
- Registered `EOS-EXECUTIVE-OFFICE-FRAMEWORK` and `EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT` as Enterprise Objects.
- Added Executive Office Management workflow and office/briefing/department events.
- Updated EOS Core API status version to `0.15.0`.
- Extended automated verification for office schema, routing data, Enterprise Object registration, workflow lookup, and event lookup.

## 0.14.0 - 2026-07-03

- Added EOS-CAP-0022: Executive Action & Approval Framework.
- Added Executive Action APIs: `GET /api/executive-actions`, `GET /api/executive-actions/:id`, and `GET /api/executive-actions/pending-approval`.
- Added 72 safe, display-only seeded executive actions from Executive Council profiles.
- Added action status, approval status, risk level, recommended next step, non-execution flag, and audit trail metadata.
- Added Mission Control action governance display with pending approval, approved, rejected, high risk, and recently updated summaries.
- Registered `EOS-EXECUTIVE-ACTION-FRAMEWORK`, `EOS-APPROVAL-QUEUE`, and `EOS-WF-EXECUTIVE-ACTION-GOVERNANCE` as Enterprise Objects.
- Added Executive Action Governance workflow and action approval events.
- Updated EOS Core API status version to `0.14.0`.
- Extended automated verification for action schema, pending approval queue, non-execution safety, Enterprise Object registration, workflow lookup, and event lookup.

## 0.13.0 - 2026-07-03

- Added EOS-CAP-0021: EOS Executive Council & Digital Enterprise Headquarters.
- Added Executive Council APIs: `GET /api/executive-council` and `GET /api/executive-council/:id`.
- Added Executive Council profiles for Eric Olo, ChatGPT, Codex, Athena, Hermes, Atlas, Mercury, Argus, and Vulcan.
- Added CEO cockpit summary with platform version, platform health, current sprint, current capability, executive attention count, top recommended action, active executives, and roadmap phase.
- Added Mission Control Executive Council view as the beginning of the Digital Enterprise Headquarters.
- Registered `EOS-EXECUTIVE-COUNCIL`, `EOS-DIGITAL-ENTERPRISE-HEADQUARTERS`, and `EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE` as Enterprise Objects.
- Added Executive Council Governance workflow and council/headquarters events.
- Updated EOS Core API status version to `0.13.0`.
- Extended automated verification for executive profile schema, CEO cockpit payload, endpoints, Enterprise Object registration, workflow lookup, and event lookup.

## 0.12.0 - 2026-07-03

- Added EOS-CAP-0020: EOS Program Management Office (PMO) & Master Roadmap.
- Added PMO APIs: `GET /api/pmo` and `GET /api/pmo/master-roadmap`.
- Registered `EOS-PMO`, `EOS-MASTER-ROADMAP`, and `EOS-WF-PROGRAM-MANAGEMENT` as Enterprise Objects.
- Added the Master Roadmap as a Live Enterprise Object with vision, mission, programs, phases, milestones, capabilities, dependencies, risks, value fields, progress, health, recommended action, and available actions.
- Added 12 initial EOS programs covering engineering foundation, executive AI workforce, AOS, ARM, DTAP, DTAM, DTAX, Second Balance Sheet, Opportunity Engine, Research & Publications, Investor Readiness, and Commercial Launch.
- Added Mission Control PMO View with programs, milestones, current sprint, current capability, progress, upcoming milestones, risks, executive ownership, and health.
- Added Program Management workflow and PMO events for program creation, program updates, milestone completion, roadmap updates, and sprint lifecycle.
- Updated EOS Core API status version to `0.12.0`.
- Extended automated verification for PMO endpoint payloads, roadmap schema, program records, capability impact references, workflow lookup, and PMO event lookup.

## 0.11.0 - 2026-07-03

- Added EOS-CAP-0016: Mission Control Knowledge Asset Viewer & Status Refinement.
- Added Mission Control Portfolio Mode and Operational Mode toggle.
- Added Live Knowledge Object asset viewer with selectable research assets and detail inspection.
- Added structured preview content for Athena research projects `RP-001` through `RP-004`.
- Extended `liveStatus` with `operationalStatus` and `lifecycleStatus` while preserving existing `status`.
- Replaced executive-facing `None` status language with `No Action Required`, `Pending Assessment`, and lifecycle-specific values.
- Registered `EOS-CAP-0016`, `EOS-ASSET-EXPLORER`, and `EOS-WF-KNOWLEDGE-ASSET-VIEWER` as Enterprise Objects.
- Added Knowledge Asset Viewer workflow and knowledge asset viewing/status/review events.
- Updated EOS Core API status version to `0.11.0`.
- Extended automated verification for asset viewer registry entries, lifecycle status, preview content, workflow lookup, and event lookup.

## 0.10.0 - 2026-07-03

- Added EOS-CAP-0015: Agent Knowledge Repository.
- Added Agent Knowledge Repository APIs: `GET /api/knowledge-repositories`, `GET /api/knowledge-repositories/:agent`, `GET /api/knowledge-objects`, and `GET /api/knowledge-objects/:id`.
- Added repository records for Codex, Athena, Hermes, Atlas, Mercury, Argus, and Vulcan.
- Seeded Athena research projects: `RP-001`, `RP-002`, `RP-003`, and `RP-004`.
- Registered `EOS-AKR`, all seeded research projects, and `EOS-WF-KNOWLEDGE-MANAGEMENT` as Enterprise Objects.
- Added Knowledge Management workflow and AKR publication, patent, investor brief, and knowledge update events.
- Added Mission Control Knowledge Repository panel.
- Updated EOS Core API status version to `0.10.0`.
- Extended automated verification for AKR endpoints and Agent Knowledge Object live status.

## 0.9.0 - 2026-07-03

- Added EOS-CAP-0014: EOS Live Object Status Layer.
- Added live status metadata to Enterprise Object API responses.
- Added a reusable backend live status service for status, health score, progress, attention state, recommended action, and available actions.
- Added Live Object Status Layer workflow registration.
- Added live status EOS Event types: `LIVE_OBJECT_STATUS_CREATED`, `LIVE_OBJECT_STATUS_UPDATED`, and `ATTENTION_REQUIRED`.
- Updated Mission Control to display live status color, health score, progress, attention level, recommended action, and available actions for every Enterprise Object.
- Added automated verification for live status fields and backup restore-validation attention rules.
- Updated EOS Core API status version to `0.9.0`.

## 0.8.1 - 2026-07-03

- Patched EOS-CAP-0009 Backup & Recovery status reporting.
- Updated `npm run eos:backup` to write the expanded `backups/backup-status.json` schema after successful backups.
- Updated `npm run eos:status` to report Last Backup, Backup Status, Backup Count, Latest Archive, and Restore Validation.
- Updated `npm run eos:release` to include backup status after backup execution.
- Added automated backup status verification through `npm run eos:backup:status` and `npm run eos:test`.

## 0.8.0 - 2026-07-03

- Added EOS-CAP-0013: Google Drive Backup Preparation.
- Added local-only Google Drive backup configuration templates under `config/`.
- Added `npm run eos:drive:status` and `npm run eos:drive:test`.
- Added a Google Drive Backup Strategy document and readiness report.
- Registered EOS-CAP-0013 as an Enterprise Object.
- Registered Google Drive Backup Preparation as a Workflow Enterprise Object.
- Added preparation events for Drive backup readiness.
- Updated EOS Core API status version to `0.8.0`.
- Extended automated verification for Drive configuration, workflow registration, and Drive preparation events.
- Added ignore rules for future local Google Drive credential files.

## 0.7.1 - 2026-07-03

- Added EOS-CAP-0012: GitHub Readiness Assessment.
- Added a GitHub Readiness Report and EOS GitHub Readiness Checklist under `docs/releases/`.
- Registered EOS-CAP-0012 as an Enterprise Object.
- Verified the local Git repository remains local-only with no configured remote.
- Documented branch strategy, GitHub organization structure, branch protection, release strategy, tagging strategy, issue labels, milestones, and project board structure.
- Updated EOS Core API status version to `0.7.1`.
- Extended automated verification for EOS-CAP-0012 registry registration and readiness links.

## 0.7.0 Genesis Baseline - 2026-07-03

- Added EOS-CAP-0011: Initial Repository Baseline & Local Release Tag.
- Added EOS Alpha 0.7.0 Genesis release artifact.
- Registered EOS-CAP-0011 as an Enterprise Object.
- Registered Initial Repository Baseline as a Workflow Enterprise Object.
- Added baseline commit and local release tag events.
- Prepared the first official EOS source control baseline.
- Preserved the existing Git repository and avoided all remote pushes.

## 0.7.0 - 2026-07-03

- Added EOS-CAP-0010: Source Control & Release Management.
- Added `npm run eos:git:status`, `npm run eos:release`, and `npm run eos:tag`.
- Added Git status reporting for branch, latest commit, uncommitted changes, EOS version, and latest tag.
- Added release manifest and release notes under `docs/releases/`.
- Registered EOS-CAP-0010 as an Enterprise Object.
- Registered Source Control & Release Management as a Workflow Enterprise Object.
- Added release-related EOS Events.
- Updated `.gitignore` for source control hygiene while preserving backup metadata logs.
- Updated EOS Core API status version to `0.7.0`.
- Extended automated verification for release workflow and event registration.

## 0.6.2 - 2026-07-03

- Added EOS-ORG-DIR-002: EOS Executive Leadership Team.
- Added Mercury, Argus, and Vulcan to the Agent Registry.
- Registered `EOS-ORG-DIR-002` as a Directive Enterprise Object.
- Registered `EOS-EXEC-LEADERSHIP-TEAM` as an Organization Enterprise Object.
- Registered `EOS-AGENT-MERCURY`, `EOS-AGENT-ARGUS`, and `EOS-AGENT-VULCAN` as Agent Enterprise Objects.
- Added department, CTO reporting line, responsibilities, and executive metadata to executive agents.
- Updated the EOS Engineering Standard with the Executive Leadership Team model.
- Updated EOS Core API status version to `0.6.2` and active agent count to `7`.
- Extended automated verification for executive metadata, reporting lines, responsibilities, and individual agent lookups.

## 0.6.1 - 2026-07-03

- Added EOS-ORG-DIR-001: Codex Chief Engineering Officer Identity.
- Registered `EOS-AGENT-CODEX` in the Agent Service and Enterprise Object Registry.
- Registered `EOS-ORG-DIR-001` as a Directive Enterprise Object.
- Updated Athena, Hermes, and Atlas executive agent roles.
- Updated the EOS Engineering Standard with the permanent Codex engineering identity and session introduction format.
- Updated EOS Core API status version to `0.6.1` and active agent count to `4`.
- Extended automated verification for Codex identity, directive registration, and agent lookup.

## 0.6.0 - 2026-07-03

- Added EOS-CAP-0009: EOS Backup & Recovery Foundation.
- Added `npm run eos:backup` and `npm run eos:restore`.
- Added timestamped ZIP backup creation under `backups/`.
- Added SHA-256 checksums, backup metadata, backup status, and restore reports.
- Registered EOS-CAP-0009 as an Enterprise Object.
- Added Backup & Recovery workflow and emitted EOS Events.
- Updated EOS Core API status version to `0.6.0`.

## Documentation - 2026-07-03

- Added EOS Engineering Standard documentation.
- Made the three-report capability closeout process mandatory for future capabilities: ECCR, BIA, and Genesis Update.
- Updated the EOS Development Guide to reference the mandatory report sequence.

## 0.5.1 - 2026-07-03

- Expanded EOS-CAP-0008: EOS Development Foundation.
- Added standard workspace folders for `services`, `apps`, `agents`, `docs`, `tests`, `scripts`, and `infrastructure`.
- Added `npm run eos:lint`.
- Added `bootstrap.sh` as the developer bootstrap entrypoint.
- Added EOS Development Guide under `docs/architecture/`.
- Expanded `eos:status` to report platform status, services, capabilities, Enterprise Objects, Knowledge Objects, agents, workflows, and events.
- Updated `eos:start` to report build version after verification.
- Updated EOS Core API status version to `0.5.1`.

## 0.5.0 - 2026-07-03

- Added EOS-CAP-0008: EOS Development Foundation.
- Added root workspace scripts: `eos:start`, `eos:stop`, `eos:status`, `eos:test`, and `eos:build`.
- Added developer bootstrap script.
- Added root README startup instructions and workspace `.gitignore`.
- Registered EOS-CAP-0008 as an Enterprise Object.
- Added Development Foundation workflow and emitted EOS Events.
- Updated EOS Core API status version to `0.5.0`.

## 0.4.1 - 2026-07-03

- Expanded EOS-CAP-0007: EOS Workflow Engine.
- Added first-class `GET /api/events` and `GET /api/events/:id` endpoints.
- Added explicit EOS Event types: `WORKFLOW_STARTED`, `WORKFLOW_COMPLETED`, `AGENT_STARTED`, `AGENT_COMPLETED`, `KNOWLEDGE_UPDATED`, and `OBJECT_CREATED`.
- Added workflow `description` fields and normalized workflow seed order.
- Extended automated verification for event registry, event lookup, event type coverage, and workflow-emitted events.
- Updated EOS Core API status version to `0.4.1`.

## 0.4.0 - 2026-07-03

- Added EOS-CAP-0007: EOS Workflow Engine.
- Added `GET /api/workflows` and `GET /api/workflows/:id`.
- Introduced EOS Events as emitted workflow records.
- Registered EOS-CAP-0007 as an Enterprise Object.
- Registered Research Publication, Opportunity Discovery, Digital Twin Formation, Knowledge Update, and Agent Coordination as Workflow Enterprise Objects.
- Extended automated verification for workflow registry, workflow lookup, EOS Events emission, and Workflow Enterprise Object registration.
- Updated EOS Core API status version to `0.4`.

## 0.3.0 - 2026-07-03

- Added EOS-CAP-0006: EOS Knowledge Service.
- Added `GET /api/knowledge` and `GET /api/knowledge/:id`.
- Registered EOS-CAP-0006 as an Enterprise Object.
- Registered EOS Genesis, Mission Control, EOS Core API, Enterprise Object Registry, and Agent Service as Knowledge Object Enterprise Objects.
- Extended automated verification for knowledge registry, knowledge lookup, and Knowledge Object Enterprise Object registration.
- Updated EOS Core API status version to `0.3`.

## 0.2.0 - 2026-07-03

- Added EOS-CAP-0005: EOS Agent Service.
- Added `GET /api/agents` and `GET /api/agents/:id`.
- Registered EOS-CAP-0005 as an Enterprise Object.
- Linked Athena, Hermes, and Atlas Enterprise Objects to the Agent Service.
- Extended automated verification for status, objects, capability registration, agents, and agent lookup.
- Updated EOS Core API status version to `0.2`.
