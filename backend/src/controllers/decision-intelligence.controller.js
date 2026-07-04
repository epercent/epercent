import {
  assessDecision,
  getDecisionIntelligenceStatus
} from '../services/decision-intelligence-service.js';

export function getDecisionIntelligence(_request, response) {
  response.status(200).json(getDecisionIntelligenceStatus());
}

export function createDecisionAssessment(request, response) {
  response.status(200).json(assessDecision(request.body ?? {}));
}
