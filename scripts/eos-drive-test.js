import { evaluateGoogleDriveReadiness, printDriveReadiness } from './eos-drive-utils.js';

const readiness = await evaluateGoogleDriveReadiness();
printDriveReadiness(readiness);

if (!readiness.passed) {
  console.error('EOS Google Drive backup configuration test failed.');
  process.exit(1);
}

console.log('EOS Google Drive backup configuration test passed.');
