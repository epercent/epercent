import {
  digitalTwinGenerationWorkflows,
  digitalTwinHomes,
  enterpriseArchitectureLayers,
  enterpriseTelemetry,
  enterpriseVisuals,
  masterMonitoring
} from '../data/enterprise-visuals.js';
import { findRecordById, listRecords } from './storage-service.js';

export function getMasterMonitoring() {
  return listRecords('master-monitoring', [masterMonitoring])[0] ?? masterMonitoring;
}

export function listEnterpriseVisuals() {
  return listRecords('enterprise-visuals', enterpriseVisuals);
}

export function getEnterpriseVisualById(id) {
  const visuals = listEnterpriseVisuals();
  const requestedId = String(id).toLowerCase();

  return (
    visuals.find(
      (visual) =>
        String(visual.id).toLowerCase() === requestedId ||
        String(visual.enterpriseId).toLowerCase() === requestedId
    ) ?? null
  );
}

export function listEnterpriseTelemetry() {
  return listRecords('enterprise-telemetry', enterpriseTelemetry);
}

export function listEnterpriseTelemetryByEnterpriseId(enterpriseId) {
  const requestedId = String(enterpriseId).toLowerCase();

  return listEnterpriseTelemetry().filter(
    (telemetry) =>
      String(telemetry.linkedDta).toLowerCase() === requestedId ||
      String(telemetry.targetObject).toLowerCase() === requestedId ||
      String(telemetry.linkedEnterpriseObject).toLowerCase() === requestedId
  );
}

export function listDigitalTwinHomes() {
  return listRecords('digital-twin-homes', digitalTwinHomes);
}

export function getDigitalTwinHomeByEnterpriseId(enterpriseId) {
  const requestedId = String(enterpriseId).toLowerCase();

  return (
    listDigitalTwinHomes().find(
      (home) =>
        String(home.id).toLowerCase() === requestedId ||
        String(home.enterpriseId).toLowerCase() === requestedId
    ) ?? null
  );
}

export function listDigitalTwinGenerationWorkflows() {
  return listRecords('digital-twin-generation-workflows', digitalTwinGenerationWorkflows);
}

export function getDigitalTwinGenerationWorkflowById(id) {
  return findRecordById('digital-twin-generation-workflows', id, digitalTwinGenerationWorkflows);
}

export function listEnterpriseArchitectureLayers() {
  return listRecords('enterprise-architecture-layers', enterpriseArchitectureLayers);
}

export function getMasterMonitoringOverview() {
  return {
    capability: 'EOS-CAP-0030',
    monitoring: getMasterMonitoring(),
    architectureLayers: listEnterpriseArchitectureLayers(),
    enterpriseVisuals: listEnterpriseVisuals(),
    digitalTwinHomes: listDigitalTwinHomes(),
    telemetry: listEnterpriseTelemetry(),
    generationWorkflows: listDigitalTwinGenerationWorkflows()
  };
}
