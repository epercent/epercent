# EOS-CAP-0008: EOS Development Foundation

## Purpose

EOS-CAP-0008 makes EOS easy to start, stop, test, build, and verify from the root workspace on any development machine.

## Root Commands

- `npm run eos:start` starts EOS Core API and Mission Control.
- `npm run eos:stop` stops managed EOS development processes.
- `npm run eos:status` verifies backend, frontend, API, and Mission Control reachability.
- `npm run eos:test` runs backend and frontend lint/build checks plus backend endpoint verification.
- `npm run eos:build` builds backend and frontend projects.
- `npm run eos:lint` runs backend and frontend lint checks.
- `npm run bootstrap` installs backend and frontend dependencies and initializes Git if needed.
- `./bootstrap.sh` runs the developer bootstrap entrypoint.

## Runtime

Development process metadata and logs are written under `.eos/`, which is ignored by Git.

## Enterprise Object Registration

EOS-CAP-0008 is registered as an Enterprise Object and linked to the Development Foundation workflow.
