import { enterpriseObjects } from '../data/enterprise-objects.js';
import { withLiveStatus } from './live-object-status.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listEnterpriseObjects() {
  return listRecords('enterprise-objects', enterpriseObjects).map((enterpriseObject) =>
    withLiveStatus(enterpriseObject)
  );
}

export function getEnterpriseObjectById(id) {
  const enterpriseObject = findRecordById('enterprise-objects', id, enterpriseObjects);

  return enterpriseObject ? withLiveStatus(enterpriseObject) : null;
}
