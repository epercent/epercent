# eOS Governed Mission Watcher

Specification ID: EOS-GOVERNED-MISSION-WATCHER-001
Status: Candidate for local review

## Purpose

Observe the Build Intelligence Bridge mission inbox and invoke the existing
one-time governed executor only after a mission has independently passed
validation and received explicit human authorization.

## Authority Boundary

The watcher has no authorization capability. It cannot propose, approve,
rewrite, broaden, or repair a mission. It only observes validated state and
invokes `bin/eos-execute` when the state is `AUTHORIZED` and
`executableNow` is true.

## Safety Controls

- Minimum polling interval of five seconds.
- One active watcher process enforced by a PID lock.
- Stale locks are recovered only when their recorded process is absent.
- Pull and execution timeouts are bounded.
- Invalid, expired, mismatched, dirty, or unauthorized missions are ignored.
- Each mission digest is attempted at most once per watcher process.
- The executor remains authoritative for digest validation, replay prevention,
  execution claiming, command policy, allowed paths, evidence, and lifecycle.
- No login persistence or background service is installed by this candidate.

## Proposed Commands

- Continuous review mode: `bin/eos-watch`
- Single-observation acceptance test: `bin/eos-watch --once`
- Package command: `npm run eos:mission:watch`
- Single-observation package command:
  `npm run eos:mission:watch:once`

## Acceptance Sequence

1. Install the candidate files on the feature branch.
2. Run syntax, lint, and repository tests.
3. Commit the watcher candidate.
4. Run a single observation against a non-executable completed mission.
5. Create a new harmless mission bound to the watcher commit.
6. Confirm that PROPOSED state is observed but never executed.
7. Record explicit terminal authorization.
8. Confirm one automatic execution and Drive completion evidence.
9. Confirm replay is refused.
10. Only then consider an explicit macOS LaunchAgent installation.
