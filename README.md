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

## Test And Build

```bash
npm run eos:test
npm run eos:build
npm run eos:lint
```

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
