# EOS-CAP-0007: EOS Workflow Engine

## Purpose

EOS-CAP-0007 introduces the EOS Workflow Engine for exposing seeded orchestration workflows through EOS Core API. The Workflow Engine coordinates work inside EOS, and every future capability should be executable through workflows.

## Endpoints

- `GET /api/workflows` returns the in-memory Workflow Registry.
- `GET /api/workflows/:id` returns one workflow by id.
- `GET /api/events` returns the EOS Event Registry and supported event types.
- `GET /api/events/:id` returns one EOS Event by id.

## Workflow Schema

Each workflow includes:

- `id`
- `name`
- `status`
- `steps`
- `owner`
- `currentStep`
- `progress`
- `linkedObjects`
- `trigger`
- `lastRun`
- `events`

## Seed Workflows

- `EOS-WF-RESEARCH-PUBLICATION` Research Publication
- `EOS-WF-OPPORTUNITY-DISCOVERY` Opportunity Discovery
- `EOS-WF-DIGITAL-TWIN-FORMATION` Digital Twin Formation
- `EOS-WF-KNOWLEDGE-UPDATE` Knowledge Update
- `EOS-WF-AGENT-COORDINATION` Agent Coordination

## EOS Events

EOS-CAP-0007 introduces EOS Events as emitted workflow records. Every seeded workflow emits at least one event. Each event includes:

- `id`
- `type`
- `sourceWorkflowId`
- `status`
- `emittedAt`
- `payload`

## Initial Event Types

- `WORKFLOW_STARTED`
- `WORKFLOW_COMPLETED`
- `AGENT_STARTED`
- `AGENT_COMPLETED`
- `KNOWLEDGE_UPDATED`
- `OBJECT_CREATED`

## Enterprise Object Registration

EOS-CAP-0007 is registered as an Enterprise Object. Every seeded workflow is also registered as a `Workflow` Enterprise Object and linked to EOS-CAP-0007.
