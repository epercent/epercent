# EOS-CAP-0003: Enterprise Object Registry

## Purpose

EOS-CAP-0003 introduces the first Enterprise Object Registry capability for EOS Core API.

## Endpoints

- `GET /api/objects` returns the in-memory Enterprise Object Registry.
- `GET /api/objects/:id` returns one Enterprise Object by id.

## Enterprise Object Schema

Each Enterprise Object includes:

- `id`
- `name`
- `type`
- `status`
- `owner`
- `layer`
- `version`
- `description`
- `linkedObjects`

## Seed Objects

- `EOS-MC-001` Mission Control
- `EOS-API-001` EOS Core API
- `EOS-AGENT-ATHENA` Athena
- `EOS-AGENT-HERMES` Hermes
- `EOS-AGENT-ATLAS` Atlas
