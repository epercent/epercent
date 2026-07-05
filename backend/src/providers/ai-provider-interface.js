export class AIProviderInterface {

  get id() {
    throw new Error("Provider id not implemented")
  }

  get name() {
    throw new Error("Provider name not implemented")
  }

  health() {
    throw new Error("health() not implemented")
  }

  capabilities() {
    throw new Error("capabilities() not implemented")
  }

  submitMission(_missionPackage) {
    throw new Error("submitMission() not implemented")
  }

  missionStatus(_providerMissionId) {
    throw new Error("missionStatus() not implemented")
  }

  retrieveArtifacts(_providerMissionId) {
    throw new Error("retrieveArtifacts() not implemented")
  }

  cancelMission(_providerMissionId) {
    throw new Error("cancelMission() not implemented")
  }
}
