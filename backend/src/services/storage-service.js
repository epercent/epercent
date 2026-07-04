import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const dataDir = join(rootDir, 'data');
export const storeDir = join(dataDir, 'store');
export const snapshotsDir = join(dataDir, 'snapshots');
export const schemaDir = join(dataDir, 'schema');
export const storageSchemaVersion = '1.0.0';

function nowIso() {
  return new Date().toISOString();
}

function safeCollectionName(collectionName) {
  return String(collectionName).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
}

function collectionPath(collectionName) {
  return join(storeDir, `${safeCollectionName(collectionName)}.json`);
}

function snapshotPath(timestamp) {
  return join(snapshotsDir, `EOS_storage_snapshot_${timestamp.replace(/[:.]/g, '-')}.json`);
}

function ensureStorageDirectories() {
  mkdirSync(storeDir, { recursive: true });
  mkdirSync(snapshotsDir, { recursive: true });
  mkdirSync(schemaDir, { recursive: true });
}

function asRecordArray(records) {
  if (Array.isArray(records)) {
    return records;
  }

  if (records === null || records === undefined) {
    return [];
  }

  return [records];
}

function envelopeFor(collectionName, records, source) {
  const normalizedRecords = asRecordArray(records);

  return {
    collectionName,
    schemaVersion: storageSchemaVersion,
    lastUpdated: nowIso(),
    recordCount: normalizedRecords.length,
    source,
    records: normalizedRecords
  };
}

function readEnvelopeFile(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function isValidEnvelope(envelope, collectionName) {
  return Boolean(
    envelope &&
      envelope.collectionName === collectionName &&
      envelope.schemaVersion &&
      typeof envelope.lastUpdated === 'string' &&
      Number.isInteger(envelope.recordCount) &&
      typeof envelope.source === 'string' &&
      Array.isArray(envelope.records)
  );
}

function writeEnvelope(collectionName, envelope) {
  ensureStorageDirectories();
  const normalizedEnvelope = {
    ...envelope,
    collectionName,
    schemaVersion: envelope.schemaVersion ?? storageSchemaVersion,
    lastUpdated: envelope.lastUpdated ?? nowIso(),
    recordCount: Array.isArray(envelope.records) ? envelope.records.length : 0,
    records: Array.isArray(envelope.records) ? envelope.records : []
  };

  writeFileSync(collectionPath(collectionName), `${JSON.stringify(normalizedEnvelope, null, 2)}\n`);

  return normalizedEnvelope;
}

export function validateCollectionExists(collectionName) {
  ensureStorageDirectories();
  return existsSync(collectionPath(collectionName));
}

export function readCollection(collectionName, fallbackRecords = [], source = `seed:${collectionName}`) {
  ensureStorageDirectories();
  const file = collectionPath(collectionName);

  if (!existsSync(file)) {
    return writeEnvelope(collectionName, envelopeFor(collectionName, fallbackRecords, source));
  }

  try {
    const envelope = readEnvelopeFile(file);

    if (isValidEnvelope(envelope, collectionName)) {
      return envelope;
    }
  } catch {
    // Fall through to seed restoration.
  }

  return writeEnvelope(collectionName, envelopeFor(collectionName, fallbackRecords, source));
}

export function writeCollection(collectionName, records, source = `manual:${collectionName}`) {
  return writeEnvelope(collectionName, envelopeFor(collectionName, records, source));
}

export function initializeCollection({
  collectionName,
  records,
  source = `seed:${collectionName}`,
  mergeMissing = true,
  refreshExisting = true
}) {
  ensureStorageDirectories();
  const file = collectionPath(collectionName);

  if (!existsSync(file)) {
    return writeCollection(collectionName, records, source);
  }

  const fallbackEnvelope = envelopeFor(collectionName, records, source);

  let existingEnvelope;
  try {
    existingEnvelope = readEnvelopeFile(file);
  } catch {
    return writeEnvelope(collectionName, fallbackEnvelope);
  }

  if (!isValidEnvelope(existingEnvelope, collectionName)) {
    return writeEnvelope(collectionName, fallbackEnvelope);
  }

  if (!mergeMissing) {
    return existingEnvelope;
  }

  const seedRecords = asRecordArray(records);
  const seedRecordsById = new Map(
    seedRecords
      .filter((record) => typeof record?.id === 'string' && record.id.length > 0)
      .map((record) => [record.id, record])
  );
  const existingIds = new Set(
    existingEnvelope.records
      .map((record) => record?.id)
      .filter((id) => typeof id === 'string' && id.length > 0)
  );
  const refreshedRecords = refreshExisting
    ? [
        ...seedRecords,
        ...existingEnvelope.records.filter((record) => !record?.id || !seedRecordsById.has(record.id))
      ]
    : existingEnvelope.records;
  const missingRecords = refreshExisting
    ? []
    : seedRecords.filter((record) => {
        if (!record?.id) {
          return false;
        }

        return !existingIds.has(record.id);
      });
  const didRefresh = JSON.stringify(refreshedRecords) !== JSON.stringify(existingEnvelope.records);

  if (missingRecords.length === 0 && !didRefresh) {
    return existingEnvelope;
  }

  return writeEnvelope(collectionName, {
    ...existingEnvelope,
    lastUpdated: nowIso(),
    source: `${existingEnvelope.source}; refreshed:${source}`,
    records: [...refreshedRecords, ...missingRecords]
  });
}

export function listRecords(collectionName, fallbackRecords = [], source = `seed:${collectionName}`) {
  return readCollection(collectionName, fallbackRecords, source).records;
}

export function findRecordById(collectionName, id, fallbackRecords = [], source = `seed:${collectionName}`) {
  const requestedId = String(id).toLowerCase();

  return (
    listRecords(collectionName, fallbackRecords, source).find(
      (record) => String(record?.id ?? '').toLowerCase() === requestedId
    ) ?? null
  );
}

export function updateRecord(collectionName, id, updater, fallbackRecords = [], source = `seed:${collectionName}`) {
  const envelope = readCollection(collectionName, fallbackRecords, source);
  const requestedId = String(id).toLowerCase();
  let wasUpdated = false;
  const records = envelope.records.map((record) => {
    if (String(record?.id ?? '').toLowerCase() !== requestedId) {
      return record;
    }

    wasUpdated = true;
    return typeof updater === 'function' ? updater(record) : { ...record, ...updater };
  });

  if (!wasUpdated) {
    return null;
  }

  writeEnvelope(collectionName, {
    ...envelope,
    lastUpdated: nowIso(),
    source: `update:${collectionName}`,
    records
  });

  return records.find((record) => String(record?.id ?? '').toLowerCase() === requestedId) ?? null;
}

export function listCollectionSummaries() {
  ensureStorageDirectories();

  return readdirSync(storeDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort()
    .map((fileName) => {
      const file = join(storeDir, fileName);
      const envelope = readEnvelopeFile(file);

      return {
        collectionName: envelope.collectionName,
        schemaVersion: envelope.schemaVersion,
        lastUpdated: envelope.lastUpdated,
        recordCount: envelope.recordCount,
        source: envelope.source,
        path: relative(rootDir, file)
      };
    });
}

export function createSnapshot(reason = 'manual') {
  ensureStorageDirectories();
  const timestamp = nowIso();
  const collections = listCollectionSummaries().map((summary) => readCollection(summary.collectionName));
  const snapshot = {
    snapshotId: `EOS-STORAGE-SNAPSHOT-${timestamp}`,
    reason,
    createdAt: timestamp,
    collectionCount: collections.length,
    collections
  };
  const file = snapshotPath(timestamp);

  writeFileSync(file, `${JSON.stringify(snapshot, null, 2)}\n`);

  return {
    ...snapshot,
    path: relative(rootDir, file)
  };
}

export function getStorageHealthReport(expectedCollections = []) {
  ensureStorageDirectories();
  const collectionSummaries = listCollectionSummaries();
  const foundCollectionNames = collectionSummaries.map((collection) => collection.collectionName);
  const collectionsMissing = expectedCollections.filter(
    (collectionName) => !foundCollectionNames.includes(collectionName)
  );
  const recordCounts = Object.fromEntries(
    collectionSummaries.map((collection) => [collection.collectionName, collection.recordCount])
  );
  const latestUpdated = collectionSummaries
    .map((collection) => collection.lastUpdated)
    .filter(Boolean)
    .sort()
    .at(-1) ?? null;
  const snapshotCount = readdirSync(snapshotsDir).filter((fileName) => fileName.endsWith('.json')).length;
  const warnings = [];

  if (collectionsMissing.length > 0) {
    warnings.push('One or more expected persistent collections are missing.');
  }

  for (const collection of collectionSummaries) {
    if (collection.recordCount === 0) {
      warnings.push(`${collection.collectionName} has no records.`);
    }
  }

  return {
    capability: 'EOS-CAP-0025',
    storageStatus: warnings.length === 0 ? 'Operational' : 'Requires Attention',
    storageRoot: relative(rootDir, storeDir),
    collectionsFound: foundCollectionNames,
    collectionsMissing,
    recordCounts,
    lastUpdated: latestUpdated,
    snapshotCount,
    warnings
  };
}

export function readCollectionByName(collectionName) {
  return readCollection(collectionName);
}

export function getCollectionEnvelope(collectionName) {
  ensureStorageDirectories();
  const file = collectionPath(collectionName);

  if (!existsSync(file)) {
    return null;
  }

  try {
    const envelope = readEnvelopeFile(file);
    return isValidEnvelope(envelope, collectionName) ? envelope : null;
  } catch {
    return null;
  }
}
