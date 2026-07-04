import {
  getExecutiveOfficeById,
  getExecutiveOfficeFramework,
  listExecutiveOffices
} from '../services/executive-office-service.js';

export function listOffices(_request, response) {
  const offices = listExecutiveOffices();

  response.status(200).json({
    capability: 'EOS-CAP-0023',
    framework: getExecutiveOfficeFramework(),
    count: offices.length,
    offices
  });
}

export function getOffice(request, response) {
  const office = getExecutiveOfficeById(request.params.id);

  if (!office) {
    return response.status(404).json({
      error: 'Executive office not found',
      id: request.params.id
    });
  }

  return response.status(200).json(office);
}
