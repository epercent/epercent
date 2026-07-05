import { getAiDevelopmentOffice } from '../services/ai-development-office-service.js'

export function getAiDevelopmentOfficeController(req, res) {
  res.json(getAiDevelopmentOffice())
}
