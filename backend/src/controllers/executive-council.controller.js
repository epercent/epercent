import {
  getCeoCockpit,
  getDigitalEnterpriseHeadquarters,
  getExecutiveCouncil,
  getExecutiveProfileById,
  listExecutiveProfiles
} from '../services/executive-council-service.js';

export function listExecutiveCouncil(_request, response) {
  const executives = listExecutiveProfiles();

  response.status(200).json({
    capability: 'EOS-CAP-0021',
    council: getExecutiveCouncil(),
    headquarters: getDigitalEnterpriseHeadquarters(),
    ceoCockpit: getCeoCockpit(),
    count: executives.length,
    executives
  });
}

export function getExecutiveProfile(request, response) {
  const executiveProfile = getExecutiveProfileById(request.params.id);

  if (!executiveProfile) {
    return response.status(404).json({
      error: 'Executive profile not found',
      id: request.params.id
    });
  }

  return response.status(200).json(executiveProfile);
}
