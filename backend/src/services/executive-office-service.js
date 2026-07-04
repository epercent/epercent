import {
  executiveOfficeFramework,
  executiveOffices
} from '../data/executive-offices.js';
import { listRecords } from './storage-service.js';

export function getExecutiveOfficeFramework() {
  return listRecords('executive-office-framework', [executiveOfficeFramework])[0] ?? executiveOfficeFramework;
}

export function listExecutiveOffices() {
  return listRecords('executive-offices', executiveOffices);
}

export function getExecutiveOfficeById(id) {
  const requestedId = id.toLowerCase();

  return (
    listExecutiveOffices().find(
      (office) =>
        office.id.toLowerCase() === requestedId ||
        office.executiveId.toLowerCase() === requestedId ||
        office.executiveName.toLowerCase() === requestedId
    ) ?? null
  );
}
