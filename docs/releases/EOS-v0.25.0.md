# EOS v0.25.0

Release Name: EOS Alpha 0.25.0 - Platform Audit & Capability Readiness Center

Release Date: 2026-07-04

## Capabilities Included

- EOS-CAP-0033: Platform Audit & Capability Readiness Center

## Summary

EOS v0.25.0 adds the first internal platform audit layer. EOS can now report what is fully functional, operational foundation, display-only, partial, placeholder, broken, and not started. Mission Control includes Platform / Audit, and the root workspace includes `npm run eos:audit`.

## New API

- `GET /api/audit`

## New Automation

- `npm run eos:audit`

## New Enterprise Objects

- `EOS-CAP-0033`
- `EOS-PLATFORM-AUDIT-CENTER`
- `EOS-CAPABILITY-READINESS-MATRIX`
- `EOS-FUNCTIONAL-COVERAGE-REPORT`
- `EOS-AUDIT-READINESS-SCORE`

## New Workflow

- `EOS-WF-PLATFORM-AUDIT-READINESS`

## New Events

- `PLATFORM_AUDIT_CREATED`
- `CAPABILITY_READINESS_UPDATED`
- `FUNCTIONAL_GAP_IDENTIFIED`
- `READINESS_SCORE_UPDATED`
- `AUDIT_REPORT_GENERATED`

## Known Limitations

- Browser-based UI probing is not yet automated.
- Historical audit trend storage is not implemented yet.
- Production security, governed writes, restore validation, real connectors, and workflow execution remain future work.

## Next Release Objectives

- Data Source Connector Framework
- AI Extraction & Enterprise Object Generation
- Persistent Write API & Governance Audit Ledger
