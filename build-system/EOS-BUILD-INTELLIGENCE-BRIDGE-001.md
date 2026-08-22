# eOS Build Intelligence Bridge

Specification ID: EOS-BIB-001
Version: 0.1.0
Status: Candidate

## Mission

Capture governed terminal executions as durable, machine-readable build
intelligence and synchronize sanitized evidence to an authorized Google Drive
source readable by human and AI collaborators.

## Safety Boundary

- Credentials and OAuth tokens must never be stored in the repository.
- The rclone remote is configured outside the repository.
- Generated local evidence is stored under `logs/build-intelligence/`.
- Generated evidence is excluded from Git.
- Terminal output is redacted before persistence and synchronization.
- The bridge does not independently approve, commit, promote, or deploy changes.

## Invocation

```text
bin/eos-run <objective-id> -- <command> [arguments...]
```

## Evidence

Each run records:

- objective and run identity;
- command and exit status;
- start, completion, and duration;
- branch and commit provenance;
- repository state before and after;
- initiating system and authority;
- sanitized terminal output;
- SHA-256 output checksum;
- Drive synchronization outcome.

## Drive Structure

- `Current-State/EOS-CURRENT-STATE.md`
- `Runs/YYYY-MM-DD/<run-id>.md`
- `Failures/YYYY-MM-DD/<run-id>.md`
- `Ledgers/EOS-BUILD-LEDGER.ndjson`
- `Decisions/`

## Default Authority

The candidate defaults to `A1-assisted-human-authorized`. Higher autonomy must
not be inferred from execution through the bridge.
