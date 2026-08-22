# eOS Governed Bidirectional Control Loop

Specification ID: EOS-GCL-001
Version: 0.1.0
Status: Candidate

## Purpose

Provide a bidirectional mission channel between ChatGPT and the canonical eOS
terminal while preserving explicit human authorization, validation, provenance,
least privilege, bounded execution, replay protection, and permanent evidence.

## Initial Autonomy Boundary

- AEAF level: A1 Assisted.
- ChatGPT may propose missions but may not authorize them.
- Proposed Drive content is treated as untrusted input.
- The terminal must validate schema, branch, commit, expiry, allowed command,
  allowed paths, repository cleanliness, and authorization before execution.
- The initial validator has no execution capability.

## Control Lifecycle

`EMPTY -> PROPOSED -> AUTHORIZED -> EXECUTING -> COMPLETED`

Exceptional states:

- `REJECTED`
- `QUARANTINED`

## Initial Command Allowlist

- `node`
- `npm`

Shell interpreters and arbitrary shell strings are not permitted.
