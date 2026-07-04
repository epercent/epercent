import { evaluateGoogleDriveReadiness, printDriveReadiness } from './eos-drive-utils.js';

const readiness = await evaluateGoogleDriveReadiness();
printDriveReadiness(readiness);

if (!readiness.passed) {
  process.exit(1);
}
