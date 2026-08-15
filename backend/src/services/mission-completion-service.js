export function completeMission({
  mission,
  engineeringPackage,
  governanceReview,
  verification,
  promotion,
  gitCommit
}) {
  const errors = []

  if (!mission?.id) {
    errors.push(
      'Mission ID missing.'
    )
  }

  if (
    !engineeringPackage?.packageId
  ) {
    errors.push(
      'Engineering Package missing.'
    )
  }

  if (
    governanceReview?.decision !==
    'Approved'
  ) {
    errors.push(
      'Governance approval missing.'
    )
  }

  if (
    verification?.success !== true ||
    verification?.verdict !==
      'PASS'
  ) {
    errors.push(
      'Autonomous verification PASS missing.'
    )
  }

  if (
    promotion?.success !== true ||
    promotion?.promotionExecuted !==
      true ||
    promotion?.status !==
      'Files Promoted'
  ) {
    errors.push(
      'Governed promotion not completed.'
    )
  }

  if (
    gitCommit?.success !== true ||
    gitCommit?.status !==
      'Committed' ||
    gitCommit?.commitExecuted !==
      true ||
    !gitCommit?.commit
  ) {
    errors.push(
      'Git commit not completed.'
    )
  }

  if (
    gitCommit?.pushExecuted === true
  ) {
    errors.push(
      'Unexpected automatic Git push detected.'
    )
  }

  if (
    verification?.packageId &&
    engineeringPackage?.packageId &&
    verification.packageId !==
      engineeringPackage.packageId
  ) {
    errors.push(
      'Verification package does not match Engineering Package.'
    )
  }

  if (
    verification?.missionId &&
    mission?.id &&
    verification.missionId !==
      mission.id
  ) {
    errors.push(
      'Verification mission does not match mission.'
    )
  }

  if (
    Array.isArray(
      promotion?.promoted
    ) &&
    Array.isArray(
      gitCommit?.committedFiles
    )
  ) {
    const promotedFiles =
      promotion.promoted
        .map(item =>
          item.repositoryPath
        )
        .filter(Boolean)
        .sort()

    const committedFiles =
      [
        ...gitCommit.committedFiles
      ].sort()

    if (
      promotedFiles.length !==
      committedFiles.length ||
      promotedFiles.some(
        (file, index) =>
          file !==
          committedFiles[index]
      )
    ) {
      errors.push(
        'Committed files do not match promoted files.'
      )
    }
  }

  if (errors.length) {
    return {
      success: false,
      status:
        'Mission Incomplete',
      errors,
      nextStep:
        'Return to Hermes'
    }
  }

  return {
    success: true,
    status:
      'Mission Complete',

    completedAt:
      new Date().toISOString(),

    missionId:
      mission.id,

    packageId:
      engineeringPackage.packageId,

    commit:
      gitCommit.commit,

    previousCommit:
      gitCommit.previousCommit ??
      null,

    branch:
      gitCommit.branch ??
      null,

    committedFiles:
      gitCommit.committedFiles ??
      [],

    engineeringSummary: {
      validation:
        true,
      workspace:
        true,
      testing:
        true,
      verification:
        true,
      governance:
        true,
      promotion:
        true,
      committed:
        true,
      pushed:
        false
    },

    nextStep:
      'Generate Next Mission'
  }
}
