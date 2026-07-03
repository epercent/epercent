import {
  getEnterpriseObjectById,
  listEnterpriseObjects
} from '../services/enterprise-object-registry.js';

export function listObjects(_request, response) {
  const objects = listEnterpriseObjects();

  response.status(200).json({
    capability: 'EOS-CAP-0003',
    count: objects.length,
    objects
  });
}

export function getObjectById(request, response) {
  const enterpriseObject = getEnterpriseObjectById(request.params.id);

  if (!enterpriseObject) {
    return response.status(404).json({
      error: 'Enterprise Object not found',
      id: request.params.id
    });
  }

  return response.status(200).json(enterpriseObject);
}
