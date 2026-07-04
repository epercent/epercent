# EOS v0.24.1 - Onboarded Enterprises View Patch

Release Date: 2026-07-04

## Summary

EOS v0.24.1 separates detailed onboarded enterprise and organization portfolio review from Master Monitoring.

## Changes

- Added a dedicated Mission Control Onboarded Enterprises view under Enterprise Value.
- Added enterprise portfolio metrics for onboarding records, visual enterprise homes, DTA candidates, feed requirements, validation items, and attention required.
- Updated Enterprise Value navigation and backend platform navigation metadata.
- Kept Master Monitoring focused on aggregate monitoring and retained the onboarded enterprise count in the headline summary metrics.

## Verification

- `npm run eos:lint`
- `npm run eos:build`
- `npm run eos:test`
- `npm run eos:backup`
- `npm run eos:status`
