import { generateEngineeringMissions } from '../services/mission-generator-service.js';
import { engineeringChangeRequests } from '../data/engineering-change-requests.js';

export function getGeneratedMissions(req, res) {
  res.json(generateEngineeringMissions(engineeringChangeRequests));
}
