import { execFileSync } from 'node:child_process';
import {
  accessSync,
  constants,
  existsSync,
  readFileSync,
  statfsSync
} from 'node:fs';
import { arch, freemem, platform, release, totalmem } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serviceDir = dirname(fileURLToPath(import.meta.url));
export const canonicalRootDir = resolve(serviceDir, '..', '..', '..');

export const ENVIRONMENT_VALIDATION_ERROR_CODES = Object.freeze({
  INVALID_ROOT: 'EOS-ENV-001',
  INVALID_PACKAGE: 'EOS-ENV-002',
  UNSUPPORTED_NODE_VERSION: 'EOS-ENV-003',
  REQUIRED_FILE_MISSING: 'EOS-ENV-004',
  REQUIRED_DIRECTORY_MISSING: 'EOS-ENV-005',
  INVALID_GIT_REPOSITORY: 'EOS-ENV-006',
  INVALID_BRANCH: 'EOS-ENV-007',
  INVALID_CONFIGURATION: 'EOS-ENV-008',
  INSUFFICIENT_MEMORY: 'EOS-ENV-009',
  INSUFFICIENT_DISK: 'EOS-ENV-010',
  INVALID_PORT: 'EOS-ENV-011',
  REQUIRED_SERVICE_MISSING: 'EOS-ENV-012',
  REQUIRED_CAPABILITY_MISSING: 'EOS-ENV-013',
  VALIDATION_EXECUTION_ERROR: 'EOS-ENV-014'
});

const requiredFiles = Object.freeze([
  'README.md',
  'package.json',
  'CANONICAL_REPOSITORY.md',
  'BUILD_MANIFEST.md',
  'backend/package.json',
  'backend/src/app.js',
  'backend/src/server.js',
  'backend/src/config/env.js'
]);

const requiredDirectories = Object.freeze([
  'backend',
  'backend/src',
  'backend/src/controllers',
  'backend/src/routes',
  'backend/src/services',
  'config',
  'data',
  'docs',
  'runtime',
  'scripts',
  'tests'
]);

const requiredServices = Object.freeze([
  'backend/src/services/storage-service.js',
  'backend/src/services/storage-bootstrap.js',
  'backend/src/services/platform-operations-service.js',
  'backend/src/services/autonomous-engineering-runtime-service.js'
]);

const requiredCapabilities = Object.freeze([
  'backend/src/services/enterprise-object-registry.js',
  'backend/src/services/knowledge-service.js',
  'backend/src/services/workflow-service.js',
  'backend/src/services/event-service.js'
]);

function createCheck({
  id,
  category,
  name,
  status,
  required = true,
  message,
  errorCode = null,
  details = {}
}) {
  return {
    id,
    category,
    name,
    status,
    required,
    message,
    errorCode,
    details
  };
}

function safelyReadJson(file) {
  try {
    return {
      ok: true,
      value: JSON.parse(readFileSync(file, 'utf8'))
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
}

function safelyRunGit(rootDir, args) {
  try {
    return {
      ok: true,
      value: execFileSync('git', args, {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }).trim()
    };
  } catch (error) {
    return {
      ok: false,
      error: error.stderr?.toString().trim() || error.message
    };
  }
}

function validateRuntime(rootDir, options) {
  const checks = [];
  const packageFile = join(rootDir, 'package.json');
  const packageResult = safelyReadJson(packageFile);

  checks.push(
    createCheck({
      id: 'runtime-root',
      category: 'runtime',
      name: 'Canonical runtime root',
      status: existsSync(packageFile) ? 'PASS' : 'FAIL',
      message: existsSync(packageFile)
        ? `Runtime root detected at ${rootDir}`
        : `package.json was not found at ${rootDir}`,
      errorCode: existsSync(packageFile)
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_ROOT,
      details: { rootDir }
    })
  );

  checks.push(
    createCheck({
      id: 'runtime-package',
      category: 'runtime',
      name: 'Runtime package manifest',
      status: packageResult.ok && packageResult.value?.name === 'eos' ? 'PASS' : 'FAIL',
      message:
        packageResult.ok && packageResult.value?.name === 'eos'
          ? `EOS package ${packageResult.value.version ?? 'unknown'} loaded`
          : `Invalid EOS package manifest: ${packageResult.error ?? 'package name is not eos'}`,
      errorCode:
        packageResult.ok && packageResult.value?.name === 'eos'
          ? null
          : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_PACKAGE,
      details: packageResult.ok
        ? {
            name: packageResult.value.name,
            version: packageResult.value.version,
            requiredNode: packageResult.value.engines?.node ?? null
          }
        : {}
    })
  );

  const currentNodeMajor = Number.parseInt(process.versions.node.split('.')[0], 10);
  const minimumNodeMajor = options.minimumNodeMajor ?? 20;
  const nodeSupported = Number.isInteger(currentNodeMajor) && currentNodeMajor >= minimumNodeMajor;

  checks.push(
    createCheck({
      id: 'runtime-node',
      category: 'runtime',
      name: 'Node.js version',
      status: nodeSupported ? 'PASS' : 'FAIL',
      message: nodeSupported
        ? `Node.js ${process.version} satisfies minimum major version ${minimumNodeMajor}`
        : `Node.js ${process.version} does not satisfy minimum major version ${minimumNodeMajor}`,
      errorCode: nodeSupported
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.UNSUPPORTED_NODE_VERSION,
      details: {
        current: process.version,
        minimumMajor: minimumNodeMajor
      }
    })
  );

  return checks;
}

function validateSystem(rootDir, options) {
  const checks = [];
  const minimumFreeMemoryBytes =
    options.minimumFreeMemoryBytes ?? 256 * 1024 * 1024;
  const minimumFreeDiskBytes =
    options.minimumFreeDiskBytes ?? 512 * 1024 * 1024;

  const availableMemory = freemem();
  const memoryPass = availableMemory >= minimumFreeMemoryBytes;

  checks.push(
    createCheck({
      id: 'system-memory',
      category: 'system',
      name: 'Available memory',
      status: memoryPass ? 'PASS' : 'FAIL',
      message: memoryPass
        ? `${availableMemory} bytes of free memory available`
        : `${availableMemory} bytes available; ${minimumFreeMemoryBytes} required`,
      errorCode: memoryPass
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INSUFFICIENT_MEMORY,
      details: {
        freeBytes: availableMemory,
        totalBytes: totalmem(),
        minimumFreeBytes: minimumFreeMemoryBytes
      }
    })
  );

  try {
    const disk = statfsSync(rootDir);
    const availableDisk = disk.bavail * disk.bsize;
    const diskPass = availableDisk >= minimumFreeDiskBytes;

    checks.push(
      createCheck({
        id: 'system-disk',
        category: 'system',
        name: 'Available disk space',
        status: diskPass ? 'PASS' : 'FAIL',
        message: diskPass
          ? `${availableDisk} bytes of disk space available`
          : `${availableDisk} bytes available; ${minimumFreeDiskBytes} required`,
        errorCode: diskPass
          ? null
          : ENVIRONMENT_VALIDATION_ERROR_CODES.INSUFFICIENT_DISK,
        details: {
          freeBytes: availableDisk,
          minimumFreeBytes: minimumFreeDiskBytes
        }
      })
    );
  } catch (error) {
    checks.push(
      createCheck({
        id: 'system-disk',
        category: 'system',
        name: 'Available disk space',
        status: 'FAIL',
        message: `Unable to determine disk availability: ${error.message}`,
        errorCode: ENVIRONMENT_VALIDATION_ERROR_CODES.VALIDATION_EXECUTION_ERROR
      })
    );
  }

  checks.push(
    createCheck({
      id: 'system-platform',
      category: 'system',
      name: 'Operating system and architecture',
      status: 'PASS',
      message: `${platform()} ${release()} on ${arch()}`,
      details: {
        platform: platform(),
        release: release(),
        architecture: arch()
      }
    })
  );

  return checks;
}

function validatePaths(rootDir, paths, category, errorCode) {
  return paths.map((relativePath, index) => {
    const absolutePath = join(rootDir, relativePath);
    const exists = existsSync(absolutePath);

    if (exists) {
      try {
        accessSync(absolutePath, constants.R_OK);
      } catch {
        return createCheck({
          id: `${category}-${index + 1}`,
          category,
          name: relativePath,
          status: 'FAIL',
          message: `${relativePath} exists but is not readable`,
          errorCode,
          details: { relativePath, absolutePath }
        });
      }
    }

    return createCheck({
      id: `${category}-${index + 1}`,
      category,
      name: relativePath,
      status: exists ? 'PASS' : 'FAIL',
      message: exists
        ? `${relativePath} is present and readable`
        : `${relativePath} is missing`,
      errorCode: exists ? null : errorCode,
      details: { relativePath, absolutePath }
    });
  });
}

function validateRepository(rootDir, options) {
  const checks = [];
  const gitRootResult = safelyRunGit(rootDir, ['rev-parse', '--show-toplevel']);
  const branchResult = safelyRunGit(rootDir, ['branch', '--show-current']);
  const statusResult = safelyRunGit(rootDir, ['status', '--porcelain']);

  const normalizedGitRoot = gitRootResult.ok ? resolve(gitRootResult.value) : null;
  const repositoryPass = gitRootResult.ok && normalizedGitRoot === resolve(rootDir);

  checks.push(
    createCheck({
      id: 'repository-root',
      category: 'repository',
      name: 'Git repository root',
      status: repositoryPass ? 'PASS' : 'FAIL',
      message: repositoryPass
        ? `Git repository root confirmed at ${normalizedGitRoot}`
        : `Git repository root validation failed: ${gitRootResult.error ?? normalizedGitRoot}`,
      errorCode: repositoryPass
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_GIT_REPOSITORY,
      details: {
        expected: resolve(rootDir),
        actual: normalizedGitRoot
      }
    })
  );

  const expectedBranch = options.expectedBranch ?? 'main';
  const branchPass = branchResult.ok && branchResult.value === expectedBranch;

  checks.push(
    createCheck({
      id: 'repository-branch',
      category: 'repository',
      name: 'Git branch',
      status: branchPass ? 'PASS' : 'FAIL',
      message: branchPass
        ? `Repository is on ${expectedBranch}`
        : `Repository branch is ${branchResult.value || 'unknown'}; expected ${expectedBranch}`,
      errorCode: branchPass
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_BRANCH,
      details: {
        current: branchResult.value || null,
        expected: expectedBranch
      }
    })
  );

  checks.push(
    createCheck({
      id: 'repository-working-tree',
      category: 'repository',
      name: 'Working tree state',
      status: statusResult.ok ? 'PASS' : 'FAIL',
      required: false,
      message: statusResult.ok
        ? statusResult.value
          ? 'Working tree contains changes'
          : 'Working tree is clean'
        : `Unable to inspect working tree: ${statusResult.error}`,
      errorCode: statusResult.ok
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_GIT_REPOSITORY,
      details: {
        clean: statusResult.ok ? statusResult.value.length === 0 : false,
        changedEntries: statusResult.ok
          ? statusResult.value.split('\n').filter(Boolean).length
          : null
      }
    })
  );

  return checks;
}

function validateConfiguration(options) {
  const checks = [];
  const portValue = options.port ?? process.env.PORT ?? '3000';
  const port = Number.parseInt(String(portValue), 10);
  const portPass = Number.isInteger(port) && port >= 1 && port <= 65535;

  checks.push(
    createCheck({
      id: 'configuration-port',
      category: 'configuration',
      name: 'Backend port',
      status: portPass ? 'PASS' : 'FAIL',
      message: portPass
        ? `Backend port ${port} is valid`
        : `Backend port ${portValue} is invalid`,
      errorCode: portPass
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_PORT,
      details: {
        configuredValue: String(portValue),
        parsedPort: Number.isNaN(port) ? null : port
      }
    })
  );

  const nodeEnvironment = options.nodeEnv ?? process.env.NODE_ENV ?? 'development';
  const allowedNodeEnvironments = ['development', 'test', 'production'];
  const nodeEnvironmentPass = allowedNodeEnvironments.includes(nodeEnvironment);

  checks.push(
    createCheck({
      id: 'configuration-node-environment',
      category: 'configuration',
      name: 'Node environment',
      status: nodeEnvironmentPass ? 'PASS' : 'FAIL',
      message: nodeEnvironmentPass
        ? `NODE_ENV ${nodeEnvironment} is supported`
        : `NODE_ENV ${nodeEnvironment} is not supported`,
      errorCode: nodeEnvironmentPass
        ? null
        : ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_CONFIGURATION,
      details: {
        current: nodeEnvironment,
        allowed: allowedNodeEnvironments
      }
    })
  );

  return checks;
}

function summarizeChecks(checks) {
  const requiredChecks = checks.filter((check) => check.required);
  const failedRequiredChecks = requiredChecks.filter(
    (check) => check.status !== 'PASS'
  );
  const warnings = checks.filter(
    (check) => !check.required && check.status !== 'PASS'
  );

  const categoryMap = new Map();

  for (const check of checks) {
    if (!categoryMap.has(check.category)) {
      categoryMap.set(check.category, []);
    }

    categoryMap.get(check.category).push(check);
  }

  const categories = Object.fromEntries(
    [...categoryMap.entries()].map(([category, categoryChecks]) => {
      const requiredCategoryChecks = categoryChecks.filter(
        (check) => check.required
      );
      const failed = requiredCategoryChecks.filter(
        (check) => check.status !== 'PASS'
      );

      return [
        category,
        {
          status: failed.length === 0 ? 'PASS' : 'FAIL',
          total: categoryChecks.length,
          passed: categoryChecks.filter((check) => check.status === 'PASS').length,
          failed: categoryChecks.filter((check) => check.status === 'FAIL').length,
          warnings: categoryChecks.filter(
            (check) => !check.required && check.status !== 'PASS'
          ).length
        }
      ];
    })
  );

  return {
    status: failedRequiredChecks.length === 0 ? 'PASS' : 'FAIL',
    totalChecks: checks.length,
    requiredChecks: requiredChecks.length,
    passedChecks: checks.filter((check) => check.status === 'PASS').length,
    failedChecks: checks.filter((check) => check.status === 'FAIL').length,
    warningChecks: warnings.length,
    failedRequiredChecks: failedRequiredChecks.length,
    categories
  };
}

export function validateRuntimeEnvironment(options = {}) {
  const rootDir = resolve(options.rootDir ?? canonicalRootDir);

  const checks = [
    ...validateRuntime(rootDir, options),
    ...validateSystem(rootDir, options),
    ...validatePaths(
      rootDir,
      options.requiredFiles ?? requiredFiles,
      'files',
      ENVIRONMENT_VALIDATION_ERROR_CODES.REQUIRED_FILE_MISSING
    ),
    ...validatePaths(
      rootDir,
      options.requiredDirectories ?? requiredDirectories,
      'directories',
      ENVIRONMENT_VALIDATION_ERROR_CODES.REQUIRED_DIRECTORY_MISSING
    ),
    ...validateRepository(rootDir, options),
    ...validateConfiguration(options),
    ...validatePaths(
      rootDir,
      options.requiredServices ?? requiredServices,
      'services',
      ENVIRONMENT_VALIDATION_ERROR_CODES.REQUIRED_SERVICE_MISSING
    ),
    ...validatePaths(
      rootDir,
      options.requiredCapabilities ?? requiredCapabilities,
      'capabilities',
      ENVIRONMENT_VALIDATION_ERROR_CODES.REQUIRED_CAPABILITY_MISSING
    )
  ];

  const summary = summarizeChecks(checks);

  return {
    capability: 'EOS-CAP-RUNTIME-ENVIRONMENT-VALIDATION',
    objective: '10.x.1',
    validator: 'EOS Runtime Environment Validator v1',
    timestamp: new Date().toISOString(),
    rootDir,
    status: summary.status,
    runtime: {
      node: process.version,
      npm: process.env.npm_config_user_agent ?? 'Not supplied',
      platform: platform(),
      release: release(),
      architecture: arch()
    },
    summary,
    checks,
    errors: checks
      .filter((check) => check.required && check.status === 'FAIL')
      .map((check) => ({
        code: check.errorCode,
        category: check.category,
        check: check.name,
        message: check.message
      })),
    warnings: checks
      .filter((check) => !check.required && check.status !== 'PASS')
      .map((check) => ({
        code: check.errorCode,
        category: check.category,
        check: check.name,
        message: check.message
      }))
  };
}
