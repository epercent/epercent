import { dispatchMission } from '../services/provider-dispatch-service.js'

export async function dispatchMissionController(req, res) {
  try {
    const result = await dispatchMission({
      provider: req.body?.provider,
      assignmentId: req.body?.assignmentId
    })

    const statusCode = result.dispatchStatus === 'DISPATCH_COMPLETED' ? 200 : 502

    return res.status(statusCode).json(result)
  } catch (error) {
    return res.status(500).json({
      dispatchStatus: 'DISPATCH_FAILED',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
