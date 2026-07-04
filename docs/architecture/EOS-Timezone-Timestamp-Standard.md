# EOS Timezone & Timestamp Standard

Version: 0.22.0

Capability: EOS-CAP-0030

## Standard

EOS stores timestamps as UTC and includes display timezone metadata where records need enterprise or user-local display.

Required fields for telemetry-like updates:

- `timestampUtc`
- `displayTimezone`

Mission Control should display:

- UTC timestamp when precision matters
- local display time for the enterprise, asset, or user where practical
- timezone labels beside local times

## Current Scope

CAP-0030 applies the standard to simulated enterprise telemetry updates. Future real-time feed integrations must preserve the same standard.
