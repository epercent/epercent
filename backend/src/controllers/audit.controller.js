import { getAuditReport } from '../services/audit-service.js';

export function getAudit(_request, response) {
  response.status(200).json(getAuditReport());
}
