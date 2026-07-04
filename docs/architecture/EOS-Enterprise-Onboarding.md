# EOS Enterprise Onboarding

Version: 0.24.0

Enterprise Onboarding captures the structured starting point for bringing an enterprise into EOS.

Mission Control separates detailed onboarded enterprise and organization portfolio management into the Enterprise Value / Onboarded Enterprises view. Master Monitoring remains the aggregated monitoring surface and retains the onboarded enterprise count in its headline summary.

The onboarding model records enterprise identity, industry, enterprise type, source documents, source systems, known assets, known processes, known people, departments, locations, contracts, risks, opportunities, assigned agents, linked Digital Mirror, linked DTA candidates, and human validation status.

The current implementation is local and seeded. It does not connect external systems or perform AI extraction.

## Responsibilities

- Hermes captures knowledge and source inventory.
- Atlas structures enterprise objects, relationships, and architecture.
- Athena supports research and documentation.
- Mercury analyzes opportunity and value signals.
- Argus defines monitoring and feed requirements.
- Vulcan owns validation, QA, and compliance gates.
- Codex owns engineering integration requirements.

## API

- `GET /api/onboarding`
- `GET /api/onboarding/:id`
- `GET /api/onboarding/:id/pipeline`
- `GET /api/onboarding-assimilation`
