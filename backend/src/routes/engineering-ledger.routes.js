import { Router } from 'express'
import { getEngineeringLedgerController } from '../controllers/engineering-ledger.controller.js'

const router = Router()

router.get('/', getEngineeringLedgerController)

export default router
