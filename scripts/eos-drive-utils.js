import { constants } from 'node:fs';
import { access, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { backupsDir, rootDir } from './eos-common.js';

export const googleDriveExampleConfigFile = join(rootDir, 'config', 'google-drive.example.json');
export const backupSyncConfigFile = join(rootDir, 'config', 'backup-sync.json');

const requiredGoogleDriveFields = [
  'driveFolderId',
  'oauthClientId',
  'oauthClientSecret',
  'refreshToken',
  'backupFrequency',
  'syncMode'
];

const credentialFields = ['driveFolderId', 'oauthClientId', 'oauthClientSecret', 'refreshToken'];
const requiredSyncFields = [
  'provider',
  'enabled',
  'mode',
  'networkAccessAllowed',
  'authenticationAllowed',
  'uploadAllowed',
  'localBackupDirectory',
  'backupMetadataFiles',
  'configTemplate',
  'expectedSyncLocations',
  'security'
];

async function fileExists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function isPlaceholder(value) {
  return typeof value === 'string' && value.startsWith('REPLACE_WITH_');
}

function hasNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function evaluateGoogleDriveReadiness() {
  const checks = [];
  const addCheck = (label, passed, detail) => {
    checks.push({ label, passed, detail });
  };

  const exampleExists = await fileExists(googleDriveExampleConfigFile);
  const syncConfigExists = await fileExists(backupSyncConfigFile);
  const backupDirectoryExists = await fileExists(backupsDir);
  const backupLogFile = join(backupsDir, 'backup-log.json');
  const backupStatusFile = join(backupsDir, 'backup-status.json');
  const backupLogExists = await fileExists(backupLogFile);
  const backupStatusExists = await fileExists(backupStatusFile);

  addCheck('Google Drive example config exists', exampleExists, 'config/google-drive.example.json');
  addCheck('Backup synchronization config exists', syncConfigExists, 'config/backup-sync.json');
  addCheck('Backup directory exists', backupDirectoryExists, 'backups');
  addCheck('Backup log exists', backupLogExists, 'backups/backup-log.json');
  addCheck('Backup status exists', backupStatusExists, 'backups/backup-status.json');

  let googleDriveConfig = null;
  let backupSyncConfig = null;

  if (exampleExists) {
    googleDriveConfig = await readJson(googleDriveExampleConfigFile);
    const missingFields = requiredGoogleDriveFields.filter((field) => !(field in googleDriveConfig));
    addCheck(
      'Google Drive example config has required fields',
      missingFields.length === 0,
      missingFields.length === 0 ? 'all required fields present' : `missing: ${missingFields.join(', ')}`
    );

    const placeholderFields = credentialFields.filter((field) => isPlaceholder(googleDriveConfig[field]));
    addCheck(
      'Google Drive credentials are placeholders',
      placeholderFields.length === credentialFields.length,
      `${placeholderFields.length}/${credentialFields.length} credential placeholders present`
    );

    addCheck(
      'Backup frequency configured',
      hasNonEmptyString(googleDriveConfig.backupFrequency),
      googleDriveConfig.backupFrequency ?? 'missing'
    );
    addCheck('Sync mode is readiness-only', googleDriveConfig.syncMode === 'readiness-only', googleDriveConfig.syncMode ?? 'missing');
  }

  if (syncConfigExists) {
    backupSyncConfig = await readJson(backupSyncConfigFile);
    const missingFields = requiredSyncFields.filter((field) => !(field in backupSyncConfig));
    addCheck(
      'Backup synchronization config has required fields',
      missingFields.length === 0,
      missingFields.length === 0 ? 'all required fields present' : `missing: ${missingFields.join(', ')}`
    );
    addCheck('Provider is Google Drive', backupSyncConfig.provider === 'google-drive', backupSyncConfig.provider ?? 'missing');
    addCheck('Synchronization is disabled', backupSyncConfig.enabled === false, String(backupSyncConfig.enabled));
    addCheck('Network access is disabled', backupSyncConfig.networkAccessAllowed === false, String(backupSyncConfig.networkAccessAllowed));
    addCheck(
      'Authentication is disabled',
      backupSyncConfig.authenticationAllowed === false,
      String(backupSyncConfig.authenticationAllowed)
    );
    addCheck('Upload is disabled', backupSyncConfig.uploadAllowed === false, String(backupSyncConfig.uploadAllowed));
  }

  let latestBackup = null;
  if (backupStatusExists) {
    const backupStatus = await readJson(backupStatusFile);
    latestBackup = backupStatus.latestBackupTimestamp ?? backupStatus.lastBackup ?? null;
  }

  let backupArchiveCount = 0;
  if (backupDirectoryExists) {
    const backupStats = await stat(backupsDir);
    addCheck('Backup path is a directory', backupStats.isDirectory(), 'backups');
  }

  if (backupLogExists) {
    const backupLog = await readJson(backupLogFile);
    backupArchiveCount = backupLog.filter((backup) => backup.status === 'Completed').length;
    addCheck('At least one completed backup exists', backupArchiveCount > 0, `${backupArchiveCount} completed backups`);
  }

  return {
    passed: checks.every((check) => check.passed),
    checks,
    googleDriveConfig,
    backupSyncConfig,
    latestBackup,
    backupArchiveCount,
    expectedSyncLocations: backupSyncConfig?.expectedSyncLocations ?? null
  };
}

export function printDriveReadiness(readiness) {
  console.log('EOS Google Drive Backup Readiness');
  console.log('---------------------------------');
  console.log(`Configuration Status: ${readiness.passed ? 'OK' : 'FAIL'}`);
  console.log('Google Drive Connection: Not attempted');
  console.log('Authentication: Not attempted');
  console.log('Upload: Not attempted');
  console.log(`Latest Backup: ${readiness.latestBackup ?? 'Unavailable'}`);
  console.log(`Completed Backups: ${readiness.backupArchiveCount}`);

  if (readiness.expectedSyncLocations) {
    console.log(`Expected Local Archives: ${readiness.expectedSyncLocations.localArchives}`);
    console.log(`Expected Local Metadata: ${readiness.expectedSyncLocations.localMetadata}`);
    console.log(`Future Drive Folder: ${readiness.expectedSyncLocations.futureDriveFolder}`);
  }

  console.log('Checks:');

  for (const check of readiness.checks) {
    console.log(`${check.passed ? 'OK' : 'FAIL'} - ${check.label}: ${check.detail}`);
  }
}
