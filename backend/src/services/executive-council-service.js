import {
  ceoCockpit,
  digitalEnterpriseHeadquarters,
  executiveCouncil,
  executiveProfiles
} from '../data/executive-council.js';
import { listRecords } from './storage-service.js';

export function getExecutiveCouncil() {
  return listRecords('executive-council', [executiveCouncil])[0] ?? executiveCouncil;
}

export function getDigitalEnterpriseHeadquarters() {
  return (
    listRecords('digital-enterprise-headquarters', [digitalEnterpriseHeadquarters])[0] ??
    digitalEnterpriseHeadquarters
  );
}

export function getCeoCockpit() {
  const storedCeoCockpit = listRecords('ceo-cockpit', [{ id: 'EOS-CEO-COCKPIT', ...ceoCockpit }])[0];

  if (!storedCeoCockpit) {
    return ceoCockpit;
  }

  const cockpit = { ...storedCeoCockpit };
  delete cockpit.id;

  return cockpit;
}

export function listExecutiveProfiles() {
  return listRecords('executive-profiles', executiveProfiles);
}

export function getExecutiveProfileById(id) {
  const requestedId = id.toLowerCase();

  return (
    listExecutiveProfiles().find(
      (profile) => profile.id.toLowerCase() === requestedId || profile.name.toLowerCase() === requestedId
    ) ?? null
  );
}
