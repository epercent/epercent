# EOS-CAP-0020: EOS Program Management Office (PMO) & Master Roadmap

## Purpose

EOS-CAP-0020 establishes EOS PMO and implements the EOS Master Roadmap as a Live Enterprise Object.

## Scope

- Registered `EOS-PMO` with owner `CTO`.
- Registered `EOS-MASTER-ROADMAP` with owner `EOS PMO`.
- Added PMO APIs.
- Added the Master Roadmap data model with vision, mission, strategic objectives, programs, phases, milestones, capabilities, dependencies, risks, value fields, progress, health, recommended action, and available actions.
- Added 12 initial EOS programs.
- Added Mission Control PMO View.
- Registered Program Management workflow and PMO events.

## API

- `GET /api/pmo`
- `GET /api/pmo/master-roadmap`

## Enterprise Objects

- `EOS-CAP-0020`
- `EOS-PMO`
- `EOS-MASTER-ROADMAP`
- `EOS-WF-PROGRAM-MANAGEMENT`

## Initial Programs

- Engineering Foundation
- Executive AI Workforce
- Agent Operating System (AOS)
- Agent Resource Management (ARM)
- Digital Twin Asset Platform (DTAP)
- Digital Twin Asset Management (DTAM)
- Digital Twin Asset Exchange (DTAX)
- Second Balance Sheet
- Opportunity Engine
- Research & Publications
- Investor Readiness
- Commercial Launch

## Events

- `PROGRAM_CREATED`
- `PROGRAM_UPDATED`
- `MILESTONE_COMPLETED`
- `ROADMAP_UPDATED`
- `SPRINT_STARTED`
- `SPRINT_COMPLETED`

## Verification

Automated verification checks PMO endpoint responses, roadmap schema, program records, capability impact references, Enterprise Object registration, workflow registration, and PMO event lookup.
