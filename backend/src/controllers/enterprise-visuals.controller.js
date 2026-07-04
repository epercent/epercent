import {
  getDigitalTwinHomeByEnterpriseId,
  getEnterpriseVisualById,
  getMasterMonitoringOverview,
  listEnterpriseTelemetry,
  listEnterpriseTelemetryByEnterpriseId,
  listEnterpriseVisuals
} from '../services/enterprise-visual-service.js';

export function getMasterMonitoring(_request, response) {
  response.status(200).json(getMasterMonitoringOverview());
}

export function getEnterpriseVisuals(_request, response) {
  const visuals = listEnterpriseVisuals();

  response.status(200).json({
    capability: 'EOS-CAP-0030',
    count: visuals.length,
    visuals
  });
}

export function getEnterpriseVisual(request, response) {
  const visual = getEnterpriseVisualById(request.params.id);

  if (!visual) {
    return response.status(404).json({
      error: 'Enterprise visual model not found',
      id: request.params.id
    });
  }

  return response.status(200).json(visual);
}

export function getEnterpriseTelemetry(_request, response) {
  const telemetry = listEnterpriseTelemetry();

  response.status(200).json({
    capability: 'EOS-CAP-0030',
    count: telemetry.length,
    telemetry
  });
}

export function getEnterpriseTelemetryForEnterprise(request, response) {
  const telemetry = listEnterpriseTelemetryByEnterpriseId(request.params.enterpriseId);

  response.status(200).json({
    capability: 'EOS-CAP-0030',
    enterpriseId: request.params.enterpriseId,
    count: telemetry.length,
    telemetry
  });
}

export function getDigitalTwinHome(request, response) {
  const home = getDigitalTwinHomeByEnterpriseId(request.params.enterpriseId);

  if (!home) {
    return response.status(404).json({
      error: 'Digital Twin Enterprise Home not found',
      enterpriseId: request.params.enterpriseId
    });
  }

  return response.status(200).json(home);
}
