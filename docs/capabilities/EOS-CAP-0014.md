# EOS-CAP-0014: EOS Live Object Status Layer

## Purpose

EOS-CAP-0014 turns Enterprise Objects into live operational objects that can report health, progress, attention needs, recommended action, and available actions.

## Live Status Interface

Each Enterprise Object API response includes:

- `status`
- `healthScore`
- `progress`
- `summary`
- `lastActivity`
- `requiresAttention`
- `attentionLevel`
- `recommendedAction`
- `availableActions`

## Status Rules

- Green: healthy, verified, no action needed.
- Amber: operational but attention recommended.
- Red: intervention required.
- Blue: information or update only.
- Grey: inactive, paused, or not yet started.

Backup & Recovery objects report Amber until restore validation is completed.

## Mission Control

Mission Control displays live status color, health score, progress, attention level, recommended action, and available actions for each Enterprise Object.

## Verification

Automated verification checks that every Enterprise Object has a valid `liveStatus` object and that backup restore-validation status is reflected correctly.
