import { getMasterRoadmap, getPmo } from '../services/pmo-service.js';

export function getPmoOverview(_request, response) {
  const pmo = getPmo();
  const masterRoadmap = getMasterRoadmap();

  response.status(200).json({
    capability: 'EOS-CAP-0020',
    pmo,
    masterRoadmap
  });
}

export function getRoadmap(_request, response) {
  response.status(200).json(getMasterRoadmap());
}
