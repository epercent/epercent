import { createEngineeringPackageStandard } from './engineering-package-standard-service.js';

export function validateEngineeringPackage(pkg) {

  const standard = createEngineeringPackageStandard();

  const errors = [];

  for (const field of standard.requiredFields) {
    if (!(field in pkg)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (pkg.governance) {

    const confidence = pkg.governance.confidence;

    if (
      typeof confidence !== 'number' ||
      confidence < 0 ||
      confidence > 1
    ) {
      errors.push('Governance confidence must be between 0 and 1.');
    }

    if (
      typeof pkg.governance.approvalRequired !== 'boolean'
    ) {
      errors.push('approvalRequired must be boolean.');
    }

    if (
      typeof pkg.governance.approvedForAutonomousExecution !== 'boolean'
    ) {
      errors.push(
        'approvedForAutonomousExecution must be boolean.'
      );
    }

  }

  if (!Array.isArray(pkg.files))
    errors.push('files must be an array.');

  if (!Array.isArray(pkg.operations))
    errors.push('operations must be an array.');

  if (!Array.isArray(pkg.tests))
    errors.push('tests must be an array.');

  if (!Array.isArray(pkg.risks))
    errors.push('risks must be an array.');

  return {
    valid: errors.length === 0,
    errors,
    checkedAt: new Date().toISOString(),
    nextStep:
      errors.length === 0
        ? 'Workspace Builder'
        : 'Return package to Hermes'
  };
}
