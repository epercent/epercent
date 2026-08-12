import {
  getAiWorkforceMemberById,
  getAiWorkforceProviderHealth,
  listAiWorkforceMembers
} from '../services/ai-workforce-member-service.js'

export function listAiWorkforceMembersController(req, res) {
  res.json(listAiWorkforceMembers())
}

export function getAiWorkforceMemberController(req, res) {
  const member = getAiWorkforceMemberById(req.params.id)

  if (!member) {
    return res.status(404).json({
      error: 'AI workforce member not found',
      id: req.params.id
    })
  }

  return res.json(member)
}

export function getAiWorkforceProviderHealthController(req, res) {
  res.json(getAiWorkforceProviderHealth())
}
