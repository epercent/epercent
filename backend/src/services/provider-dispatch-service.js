import { generateMissionPackage } from './mission-package-service.js'
import { getProvider } from '../providers/provider-registry.js'

export function dispatchMission() {

    const provider = getProvider()

    const mission = generateMissionPackage().missionPackage

    const result = provider.submitMission(mission)

    return {

        dispatchStatus: "DISPATCH_INITIATED",

        provider: provider.name,

        result

    }

}
