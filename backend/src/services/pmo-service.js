import { eosPmo, masterRoadmap } from '../data/pmo.js';
import { listRecords } from './storage-service.js';

export function getPmo() {
  return listRecords('pmo', [eosPmo])[0] ?? eosPmo;
}

export function getMasterRoadmap() {
  return listRecords('master-roadmap', [masterRoadmap])[0] ?? masterRoadmap;
}

export function listPrograms() {
  return getMasterRoadmap().programs;
}
