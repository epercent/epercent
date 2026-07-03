# EOS-CAP-0005: EOS Agent Service

## Purpose

EOS-CAP-0005 introduces the EOS Agent Service for exposing live agent registry data through EOS Core API.

## Endpoints

- `GET /api/agents` returns the seeded EOS agent registry.
- `GET /api/agents/:id` returns one EOS agent by id.

## Agent Schema

Each agent includes:

- `id`
- `name`
- `role`
- `status`
- `currentTask`
- `progress`
- `health`
- `lastUpdate`
- `capabilities`

## Seed Agents

- `EOS-AGENT-ATHENA` Athena
- `EOS-AGENT-HERMES` Hermes
- `EOS-AGENT-ATLAS` Atlas

## Enterprise Object Registration

EOS-CAP-0005 is registered as an Enterprise Object. Athena, Hermes, and Atlas are also registered as Enterprise Objects and linked to this capability.
