import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { rootDir } from '../eos-common.js';

function getOptionValue(option) {
  const index = process.argv.indexOf(option);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const authorizationFile =
  getOptionValue('--authorization-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-authorization.json'
  );

const executionFile =
  getOptionValue('--execution-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-execution.json'
  );

const targetRoot = resolve(
  getOptionValue('--target-root') ??
  rootDir
);

const resultFile =
  getOptionValue('--result-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-promotion.json'
  );

const execute =
  process.argv.includes('--execute');

const authorization =
  await readJson(
    authorizationFile,
    null
  );

const execution =
  await readJson(
    executionFile,
    null
  );

const result = {
  promoter: 'EOS Transactional Recovery Promoter v1',
  objective: '10.x.4',
  evaluatedAt: new Date().toISOString(),
  targetRoot,
  executeRequested: execute,
  authorizationValid: false,
  candidateValid: false,
  safetyCheckpoint: null,
  rollbackPerformed: false,
  promoted: false,
  status: null,
  reasons: []
};

if (!authorization) {
  result.status = 'PROMOTION_BLOCKED';
  result.reasons.push(
    'Recovery authorization is unavailable.'
  );
} else if (
  authorization.status !==
    'PROMOTION_AUTHORIZED' ||
  authorization.authorized !== true ||
  authorization.promotionAuthorized !== true
) {
  result.status = 'PROMOTION_BLOCKED';
  result.reasons.push(
    'Explicit recovery promotion authorization is required.'
  );
} else {
  result.authorizationValid = true;
}

if (!execution) {
  result.status = 'PROMOTION_BLOCKED';
  result.reasons.push(
    'Recovery execution result is unavailable.'
  );
} else if (
  execution.status !==
    'CANDIDATE_READY' ||
  execution.validation?.status !== 'PASS' ||
  execution.checksumValid !== true
) {
  result.status = 'PROMOTION_BLOCKED';
  result.reasons.push(
    'Recovery candidate is not validated and ready.'
  );
} else {
  result.candidateValid = true;
}

if (
  result.authorizationValid &&
  result.candidateValid
) {
  if (!execute) {
    result.status =
      'PROMOTION_READY';

    result.reasons.push(
      'Promotion preconditions passed. Execution was not requested.'
    );
  } else {
    const candidateRoot =
      resolve(
        execution.candidateWorkspace
      );

    if (!(await exists(candidateRoot))) {
      result.status =
        'PROMOTION_BLOCKED';

      result.reasons.push(
        'Recovery candidate workspace does not exist.'
      );
    } else if (!(await exists(targetRoot))) {
      result.status =
        'PROMOTION_BLOCKED';

      result.reasons.push(
        'Promotion target does not exist.'
      );
    } else {
      const safetyRoot =
        await mkdtemp(
          join(
            tmpdir(),
            'eos-pre-recovery-checkpoint-'
          )
        );

      result.safetyCheckpoint =
        safetyRoot;

      try {
        await cp(
          targetRoot,
          safetyRoot,
          {
            recursive: true,
            force: true
          }
        );

        const preserved = new Set([
          '.git',
          'backups',
          'runtime'
        ]);

        const targetEntries =
          await import(
            'node:fs/promises'
          ).then(
            ({ readdir }) =>
              readdir(targetRoot)
          );

        for (const entry of targetEntries) {
          if (preserved.has(entry)) {
            continue;
          }

          await rm(
            join(targetRoot, entry),
            {
              recursive: true,
              force: true
            }
          );
        }

        await cp(
          candidateRoot,
          targetRoot,
          {
            recursive: true,
            force: true
          }
        );

        const packageJson =
          await readJson(
            join(
              targetRoot,
              'package.json'
            ),
            null
          );

        const validationPassed =
          packageJson?.name === 'eos' &&
          await exists(
            join(
              targetRoot,
              'backend',
              'src',
              'app.js'
            )
          ) &&
          await exists(
            join(
              targetRoot,
              'frontend'
            )
          ) &&
          await exists(
            join(
              targetRoot,
              'data'
            )
          );

        if (!validationPassed) {
          throw new Error(
            'Post-promotion validation failed.'
          );
        }

        result.promoted = true;
        result.status =
          'PROMOTION_COMPLETED';

        result.reasons.push(
          'Recovery candidate promoted and post-promotion validation passed.'
        );
      } catch (error) {
        result.reasons.push(
          error instanceof Error
            ? error.message
            : 'Recovery promotion failed.'
        );

        try {
          const currentEntries =
            await import(
              'node:fs/promises'
            ).then(
              ({ readdir }) =>
                readdir(targetRoot)
            );

          for (
            const entry of currentEntries
          ) {
            if (
              ['.git', 'backups', 'runtime']
                .includes(entry)
            ) {
              continue;
            }

            await rm(
              join(targetRoot, entry),
              {
                recursive: true,
                force: true
              }
            );
          }

          await cp(
            safetyRoot,
            targetRoot,
            {
              recursive: true,
              force: true
            }
          );

          result.rollbackPerformed =
            true;

          result.status =
            'PROMOTION_ROLLED_BACK';
        } catch (
          rollbackError
        ) {
          result.status =
            'PROMOTION_FAILED';

          result.reasons.push(
            rollbackError instanceof Error
              ? `Rollback failed: ${rollbackError.message}`
              : 'Rollback failed.'
          );
        }
      }
    }
  }
}

await mkdir(
  dirname(resultFile),
  {
    recursive: true
  }
);

await writeFile(
  resultFile,
  `${JSON.stringify(
    result,
    null,
    2
  )}\n`
);

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);

if (
  ![
    'PROMOTION_READY',
    'PROMOTION_COMPLETED'
  ].includes(result.status)
) {
  process.exitCode = 2;
}
