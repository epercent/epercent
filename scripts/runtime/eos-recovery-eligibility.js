export function evaluateRecoveryEligibility({
  backupStatus,
  integrityValidation,
  restoreValidation,
  gitCommit,
  gitBranch,
  gitClean
}) {
  const reasons = [];

  if (backupStatus !== 'Completed') {
    reasons.push('Backup not completed');
  }

  if (integrityValidation !== 'Validated') {
    reasons.push('Integrity not validated');
  }

  if (restoreValidation !== 'Validated') {
    reasons.push('Restore not validated');
  }

  if (
    typeof gitCommit !== 'string' ||
    !/^[a-f0-9]{40}$/u.test(gitCommit)
  ) {
    reasons.push('Immutable Git commit missing');
  }

  if (
    typeof gitBranch !== 'string' ||
    gitBranch.length === 0
  ) {
    reasons.push('Git branch missing');
  }

  if (gitClean !== true) {
    reasons.push('Working tree was dirty');
  }

  return {
    eligible: reasons.length === 0,
    status:
      reasons.length === 0
        ? 'Known Good Eligible'
        : 'Ineligible',
    reasons
  };
}
