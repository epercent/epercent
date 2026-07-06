# EOS Enterprise Runtime Model

Document ID: EOS-ERM-001
Status: Active
Objective: Objective 6 — Enterprise Journey UX Refactor

## Purpose

Define the canonical runtime model that aligns EOS frontend, backend, AI Workforce, Mission Control, Digital Twins, Value Intelligence, and Commercialization around one enterprise journey.

## Core Principle

EOS must present one coherent Enterprise Journey, not multiple competing workspace systems.

The current workspace registry should be preserved as a capability registry.

The Enterprise Journey becomes the primary user navigation.

## Enterprise Journey

1. Discover
2. Understand
3. Model
4. Intelligence
5. Create Value
6. Commercialize
7. Platform

## Runtime Object

Each enterprise should maintain an Enterprise Journey State:

- enterprise
- currentStage
- completedStages
- nextStage
- progress
- activeCapabilities
- assignedAgents
- activeMission
- recommendedActions
- governanceStatus
- valueCreated

## Navigation Rule

Top-level navigation must follow the Enterprise Journey.

Do not expose duplicate top-level navigation systems.

## Capability Registry Rule

Existing workspaces, routes, APIs, and views are not removed.

They are mapped into Enterprise Journey stages.

## Mission Control Rule

Mission Control is not a navigation category.

Mission Control is the context-aware operating layer that shows:

- current enterprise
- current stage
- Digital Intelligence Profile
- AI Workforce
- recommended actions
- risks
- decisions
- next stage

## Reuse Rule

Existing frontend components should be reused wherever possible.

The shell and navigation may be refactored.

Business logic, APIs, services, and data models should not be rewritten unless required.

## Codex Implementation Instruction

Codex should implement the Enterprise Journey shell by:

1. Preserving existing components.
2. Creating an Enterprise Journey registry.
3. Mapping existing workspace routes into journey stages.
4. Replacing duplicate navigation with one journey-first sidebar.
5. Rendering Mission Control as contextual runtime state.
6. Ensuring existing routes remain functional.
7. Providing a browser-verifiable acceptance test.

## Acceptance Criteria

Objective 6 is complete when:

- One primary navigation system remains.
- The Enterprise Journey is visible as the main sidebar.
- Existing views are accessible through the journey.
- Mission Control Runtime is visible and context-aware.
- Duplicate workspace chooser is removed or demoted.
- No existing major capability is lost.
