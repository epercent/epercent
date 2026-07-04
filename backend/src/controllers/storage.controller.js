import { expectedStorageCollections } from '../services/storage-bootstrap.js';
import {
  getCollectionEnvelope,
  getStorageHealthReport,
  listCollectionSummaries
} from '../services/storage-service.js';

export function getStorageStatus(_request, response) {
  response.status(200).json(getStorageHealthReport(expectedStorageCollections));
}

export function listStorageCollections(_request, response) {
  const collections = listCollectionSummaries();

  response.status(200).json({
    capability: 'EOS-CAP-0025',
    count: collections.length,
    collections
  });
}

export function getStorageCollection(request, response) {
  const collection = getCollectionEnvelope(request.params.name);

  if (!collection) {
    return response.status(404).json({
      error: 'Storage collection not found',
      collectionName: request.params.name
    });
  }

  return response.status(200).json(collection);
}
