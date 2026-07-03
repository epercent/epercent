# EOS-CAP-0006: EOS Knowledge Service

## Purpose

EOS-CAP-0006 introduces the EOS Knowledge Service for exposing seeded platform knowledge through EOS Core API.

## Endpoints

- `GET /api/knowledge` returns the in-memory Knowledge Registry.
- `GET /api/knowledge/:id` returns one Knowledge Object by id.

## Knowledge Object Schema

Each Knowledge Object includes:

- `id`
- `title`
- `category`
- `status`
- `owner`
- `version`
- `summary`
- `lastUpdate`
- `linkedObjects`

## Seed Knowledge Objects

- `EOS-KNOWLEDGE-GENESIS` EOS Genesis
- `EOS-KNOWLEDGE-MISSION-CONTROL` Mission Control
- `EOS-KNOWLEDGE-CORE-API` EOS Core API
- `EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY` Enterprise Object Registry
- `EOS-KNOWLEDGE-AGENT-SERVICE` Agent Service

## Enterprise Object Registration

EOS-CAP-0006 is registered as an Enterprise Object. Every seeded Knowledge Object is also registered as a `Knowledge Object` Enterprise Object and linked to EOS-CAP-0006.
