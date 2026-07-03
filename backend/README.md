# EOS Core API

Backend service for the EOS platform.

## Scripts

- `npm run dev` starts the API with automatic restarts.
- `npm start` starts the API in standard Node.js mode.
- `npm run build` validates the backend source.
- `npm run lint` validates the backend source.
- `npm run check` validates the backend source.
- `npm run status` starts the API and verifies the core endpoints.

## Configuration

- `PORT` controls the API port. Defaults to `3000`.
- `HOST` controls the bind address. Defaults to `0.0.0.0`.

## Endpoint

`GET /api/status`

```json
{
  "platform": "EOS",
  "version": "0.7.0",
  "status": "Operational",
  "uptime": "Running",
  "activeAgents": 7
}
```

`GET /api/objects`

Returns the EOS-CAP-0003 Enterprise Object Registry.

`GET /api/objects/:id`

Returns one Enterprise Object by id.

`GET /api/agents`

Returns the EOS-CAP-0005 Agent Service registry.

`GET /api/agents/:id`

Returns one EOS agent by id.

`GET /api/knowledge`

Returns the EOS-CAP-0006 Knowledge Registry.

`GET /api/knowledge/:id`

Returns one Knowledge Object by id.

`GET /api/workflows`

Returns the EOS-CAP-0007 Workflow Engine registry. Every workflow includes emitted EOS Events.

`GET /api/workflows/:id`

Returns one workflow by id.

`GET /api/events`

Returns the EOS Event Registry and supported event types.

`GET /api/events/:id`

Returns one EOS Event by id.

Capability notes are documented in `docs/capabilities/`.

## Engineering Identity

`EOS-AGENT-CODEX` is the Chief Engineering Officer and is available through `GET /api/agents` and `GET /api/agents/EOS-AGENT-CODEX`.

EOS-ORG-DIR-002 establishes the Executive Leadership Team:

- Codex, Chief Engineering Officer
- Hermes, Chief Knowledge Officer
- Athena, Chief Research Officer
- Atlas, Chief Enterprise Architect
- Mercury, Chief Opportunity Officer
- Argus, Chief Operations Officer
- Vulcan, Chief Quality Officer

## Release Management

EOS-CAP-0010 registers Source Control & Release Management as a platform capability and workflow. Release automation is operated from the workspace root with `npm run eos:release`.
