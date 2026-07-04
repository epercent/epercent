# EOS Persistent Store Schema

Every JSON collection in `data/store` uses the same envelope:

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

The envelope is deliberately simple so EOS can migrate these collections into PostgreSQL tables later.
