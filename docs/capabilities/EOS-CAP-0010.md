# EOS-CAP-0010: Source Control & Release Management

## Purpose

EOS-CAP-0010 adds Git-based source control reporting, release history, release preparation, and semantic version tag support to the EOS workspace.

## Commands

- `npm run eos:git:status` reports branch, latest commit, uncommitted changes, current EOS version, and latest tag.
- `npm run eos:release` runs lint, build, test, backup, release manifest generation, and release note generation.
- `npm run eos:tag` creates a semantic version tag for the current EOS version when a release commit exists.

## Release Artifacts

- `docs/releases/RELEASE-MANIFEST.json`
- `docs/releases/EOS-v0.7.0.md`

## Git Rules

- Preserve an existing Git repository.
- Initialize Git only if it is missing.
- Do not push to GitHub from this capability.
- Do not commit automatically; prepare the workspace for commit.
- Prevent duplicate version tags.

## Enterprise Objects

- `EOS-CAP-0010`
- `EOS-WF-SOURCE-CONTROL-RELEASE`

## Events

- `EOS-EVENT-SOURCE-CONTROL-RELEASE-STARTED`
- `EOS-EVENT-RELEASE-MANIFEST-CREATED`
- `EOS-EVENT-SOURCE-CONTROL-RELEASE-COMPLETED`
