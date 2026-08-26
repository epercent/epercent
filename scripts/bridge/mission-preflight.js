export function replayedMission(entries, mission) {
  return entries.find((entry) =>
    entry.missionId === mission.missionId ||
    (entry.missionDigest && entry.missionDigest === mission.missionDigest)
  ) ?? null;
}

export function verifyArtifactIdentity(metadata, artifact) {
  if (!artifact) return { valid: true, errors: [] };
  const errors = [];
  if (!artifact?.remotePath) errors.push('artifact remote path missing');
  if (!artifact?.driveFileId) errors.push('artifact Drive file ID missing');
  if (!artifact?.sha256) errors.push('artifact SHA-256 missing');
  if (!metadata) errors.push('artifact is unavailable');
  else {
    if (metadata.IsDir === true) errors.push('artifact resolves to a directory');
    if (metadata.ID !== artifact.driveFileId) errors.push('artifact Drive file ID mismatch');
    if (!Number.isInteger(metadata.Size) || metadata.Size <= 0) errors.push('artifact is empty');
  }
  return { valid: errors.length === 0, errors };
}

export function evaluateMissionPreflight({
  mission,
  missionDigest,
  validation,
  git,
  replayEntries = [],
  refusalEntries = [],
  artifactMetadata
}) {
  const errors = [];
  if (!mission?.missionId) errors.push('mission ID missing');
  if (validation?.missionDigest !== missionDigest) errors.push('canonical digest disagreement');
  if (git.branch !== mission?.requiredBranch) errors.push('required branch mismatch');
  if (git.headCommit !== mission?.requiredCommit) errors.push('required commit mismatch');
  if (git.status) errors.push('repository is not clean');
  const replay = replayedMission(replayEntries, { missionId: mission?.missionId, missionDigest });
  if (replay) errors.push('mission identity already recorded in replay ledger');
  const refusal = replayedMission(refusalEntries, { missionId: mission?.missionId, missionDigest });
  if (refusal) errors.push('mission identity has a durable pre-claim refusal');
  const artifact = verifyArtifactIdentity(artifactMetadata, mission?.artifact);
  errors.push(...artifact.errors);
  return { valid: errors.length === 0, errors };
}
