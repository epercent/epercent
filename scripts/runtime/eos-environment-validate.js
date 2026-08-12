import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  canonicalRootDir,
  validateRuntimeEnvironment
} from '../../backend/src/services/runtime-environment-validation-service.js';

const report = validateRuntimeEnvironment();
const outputDirectory = join(canonicalRootDir, 'runtime', 'validation');
const outputFile = join(
  outputDirectory,
  'latest-environment-validation-report.json'
);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`);

console.log('');
console.log('=======================================================================');
console.log(' EOS Runtime Environment Validation');
console.log('=======================================================================');
console.log(`Status:         ${report.status}`);
console.log(`Objective:      ${report.objective}`);
console.log(`Validator:      ${report.validator}`);
console.log(`Runtime Root:   ${report.rootDir}`);
console.log(`Node:           ${report.runtime.node}`);
console.log(`Platform:       ${report.runtime.platform}`);
console.log(`Architecture:   ${report.runtime.architecture}`);
console.log(`Total Checks:   ${report.summary.totalChecks}`);
console.log(`Passed Checks:  ${report.summary.passedChecks}`);
console.log(`Failed Checks:  ${report.summary.failedChecks}`);
console.log(`Warnings:       ${report.summary.warningChecks}`);
console.log('');

for (const [category, result] of Object.entries(report.summary.categories)) {
  console.log(
    `${category.padEnd(16)} ${result.status} ` +
      `(passed=${result.passed}, failed=${result.failed}, warnings=${result.warnings})`
  );
}

if (report.errors.length > 0) {
  console.log('');
  console.log('Errors');

  for (const error of report.errors) {
    console.log(`- ${error.code}: ${error.message}`);
  }
}

if (report.warnings.length > 0) {
  console.log('');
  console.log('Warnings');

  for (const warning of report.warnings) {
    console.log(`- ${warning.code ?? 'WARNING'}: ${warning.message}`);
  }
}

console.log('');
console.log(
  'Machine-readable report: runtime/validation/latest-environment-validation-report.json'
);
console.log('=======================================================================');
console.log('');

if (report.status !== 'PASS') {
  process.exitCode = 1;
}
