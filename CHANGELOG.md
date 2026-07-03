# Changelog

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
