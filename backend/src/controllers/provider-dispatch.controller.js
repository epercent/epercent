import { dispatchMission } from '../services/provider-dispatch-service.js'

export function dispatchMissionController(req,res){

    res.json(dispatchMission())

}
