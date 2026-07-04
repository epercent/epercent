import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { getAuditReport } from '../backend/src/services/audit-service.js';
import { bootstrapStorage } from '../backend/src/services/storage-bootstrap.js';
import { rootDir } from './eos-common.js';

bootstrapStorage();

const report = getAuditReport();
const auditsDir = join(rootDir, 'docs', 'audits');
const reportFile = join(auditsDir, `EOS-Platform-Audit-v${report.auditVersion}.json`);

await mkdir(auditsDir, { recursive: true });
await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);

console.log('EOS Platform Audit');
console.log('------------------');
console.log(`Audit ID: ${report.auditId}`);
console.log(`Version: ${report.auditVersion}`);
console.log(`Overall Status: ${report.summary.overallStatus}`);
console.log(`Capabilities Audited: ${report.summary.capabilitiesAudited}`);
console.log(`Fully Functional: ${report.summary.fullyFunctional}`);
console.log(`Operational Foundations: ${report.summary.operationalFoundations}`);
console.log(`Display Only: ${report.summary.displayOnly}`);
console.log(`Partial: ${report.summary.partial}`);
console.log(`Broken: ${report.summary.broken}`);
console.log(`Alpha Readiness: ${report.summary.alphaReadiness}%`);
console.log(`Beta Readiness: ${report.summary.betaReadiness}%`);
console.log(`Version 1.0 Readiness: ${report.summary.versionOneReadiness}%`);
console.log(`Storage Status: ${report.dataPersistenceHealth.storageStatus}`);
console.log(`Technical Debt Items: ${report.technicalDebtRegister.length}`);
console.log(`Placeholder Items: ${report.placeholderRegister.length}`);
console.log(`Recommended Program: ${report.summary.recommendedNextProgram}`);
console.log(`Recommended Action: ${report.summary.recommendedNextAction}`);
console.log(`Audit Report: ${reportFile}`);

if (report.summary.broken > 0) {
  process.exit(1);
}
