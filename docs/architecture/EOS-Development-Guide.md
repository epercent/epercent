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

## Coding Standards

- Keep backend capabilities organized by data, service, controller, and route layers.
- Keep frontend features split into services and reusable components.
- Prefer explicit seeded registries until durable persistence is introduced.
- Preserve existing application behavior while preparing migrations incrementally.

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

## Versioning

EOS currently updates version metadata in package files, API status output, changelog entries, and Enterprise Objects. This should be centralized in a future capability.

## Knowledge Management

Capability documents live under capability documentation folders. EOS Genesis and architectural decisions should be captured under `docs/genesis/` and `docs/architecture/`.

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

Use:

```bash
npm run eos:restore
```

The restore command lists backups by default. Use `--latest` or `--archive <archive-name>` to validate a backup, and add `--confirm` to restore files.

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

## Alpha Genesis Baseline

EOS Alpha 0.7.0 Genesis is the first official source control baseline. It records the initial engineering foundation, local release tag target, capabilities, Enterprise Objects, agents, Knowledge Objects, workflows, events, known limitations, and next release objectives in `docs/releases/EOS-Alpha-0.7.0-Genesis.md`.
