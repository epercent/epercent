import { getLatestSprintReport } from '../services/sprint-report-service.js'

export function getSprintReport(req,res){
    res.json(getLatestSprintReport())
}
