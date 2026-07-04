# EOS Platform Administration Center

Version: 0.19.0

The Platform Administration Center gives Mission Control one executive view of platform status, build version, environment, API health, storage health, backup health, latest backup, restore validation, release posture, running URLs, warnings, and recommended administration actions.

## Safe Actions

- Refresh Status
- Run Health Check
- Run Backup
- Validate Restore
- Open Storage Status
- Open Backup Status
- Open Release Notes
- View Configuration

## Governed Actions

- Stop Platform
- Restart Platform
- Clone Environment
- Scale Workers
- Restore Backup
- Upgrade Platform

Governed actions are display-only in this capability. Execution remains disabled until permissions, persistence, and audit controls are implemented.

## Future Path

The next safe step is a persistent write API and governance audit ledger that can record decisions, approvals, and precondition checks before any execution capability is introduced.
