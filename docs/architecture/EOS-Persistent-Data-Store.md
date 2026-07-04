# EOS Persistent Data Store

Version: 0.17.0
Capability: EOS-CAP-0025
Status: Completed

## Purpose

EOS now has a local durable persistence foundation so platform registries are no longer dependent only on in-memory seed arrays. The first storage layer uses JSON files under `data/store/` while preserving existing API behavior and keeping seed data as the bootstrap and fallback source.

## Storage Layout

- `data/store/`: persisted collection envelopes.
- `data/snapshots/`: future storage snapshots.
- `data/schema/`: storage schema documentation.

Each collection file uses this envelope:

```json
{
  "collectionName": "enterprise-objects",
  "schemaVersion": "1.0.0",
  "lastUpdated": "2026-07-03T00:00:00.000Z",
  "recordCount": 1,
  "source": "seed:enterprise-objects",
  "records": []
}
```

## Collections

The first persistent store initializes these collections:

- Enterprise Objects
- Agents
- Knowledge Objects
- Agent Knowledge Repositories
- Agent Knowledge Objects
- Workflows
- Events
- Event Types
- PMO
- Master Roadmap
- Executive Council
- Digital Enterprise Headquarters
- CEO Cockpit
- Executive Profiles
- Executive Actions
- Executive Office Framework
- Executive Offices
- Enterprise Strategy
- Governance Council
- Valuation Models
- Second Balance Sheet
- DTA Monitoring
- Digital Twin Assets
- Platform Operations
- Platform Navigation
- Admin Actions
- Authorization Policies
- Action Governance
- Agent Messages
- Agent Activity
- Agent Attention Queue
- Agent Calendar
- Backup Status
- Release Metadata

## Runtime Behavior

On startup, EOS Core API bootstraps missing collections from seeded registries. Existing persisted records are preserved, and missing seed records are merged by `id` to avoid duplicates. API endpoints continue to return the same shapes while reading from persistent storage where appropriate.

## Storage API

- `GET /api/storage/status`
- `GET /api/storage/collections`
- `GET /api/storage/collections/:name`

The status endpoint reports storage status, found and missing collections, record counts, last update timestamp, snapshot count, and warnings.

## Backup Compatibility

`npm run eos:backup` includes the `data/` directory and records whether the persistent data directory was included in backup metadata. This makes local persistence compatible with the existing Backup & Recovery foundation.

## Future PostgreSQL Migration Path

The JSON store is intentionally small and replaceable. A future PostgreSQL migration should preserve the storage-service interface:

- `readCollection`
- `writeCollection`
- `updateRecord`
- `findRecordById`
- `listRecords`
- `createSnapshot`
- `getStorageHealthReport`

Recommended migration steps:

1. Add a repository adapter interface behind the storage service.
2. Add PostgreSQL tables for collections, records, events, and snapshots.
3. Write an importer from `data/store/*.json` into PostgreSQL.
4. Add migration checksums and rollback snapshots.
5. Switch read APIs to PostgreSQL behind the same service boundary.
6. Keep JSON export as a disaster recovery and portability format.

## Architecture Notes

This capability does not remove seed registries. Seeds remain the canonical bootstrap source until a future write API, permissions layer, migration plan, and database-backed governance model are approved.
