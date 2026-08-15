import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import {
  GOVERNED_WORKSPACE_MANIFEST,
  applyEngineeringPackageToWorkspace,
  getGovernedEngineeringRoot,
  getRepositoryProvenance,
  isGovernedWorkspacePath,
  readGovernedWorkspaceManifest
} from '../backend/src/services/governed-workspace-builder-service.js'

console.log(
  'Running Objective 10.5.2 governed engineering workspace tests...'
)

const packageId =
  `EPS-10-5-2-${process.pid}`

const provenance =
  getRepositoryProvenance()

assert.equal(
  provenance.available,
  true
)

const governedRoot =
  getGovernedEngineeringRoot(
    provenance.repositoryRoot
  )

const workspaceRoot =
  path.join(
    governedRoot,
    packageId
  )

const canonicalPackageFile =
  path.join(
    provenance.repositoryRoot,
    'package.json'
  )

const canonicalPackageBefore =
  fs.readFileSync(
    canonicalPackageFile,
    'utf8'
  )

const engineeringPackage = {
  packageId,

  missionId:
    'EBM-10.5.2-TEST',

  provider:
    'AI-PROVIDER-OPENAI-CODEX',

  generatedAt:
    new Date().toISOString(),

  summary:
    'Verify governed engineering workspace isolation.',

  files: [
    {
      path:
        'proof/workspace-proof.js',

      action:
        'create',

      language:
        'javascript',

      content:
        'export const governedWorkspaceProof = true\n',

      reason:
        'Objective 10.5.2 deterministic proof.'
    }
  ],

  operations: [],

  tests: [],

  risks: [],

  governance: {
    confidence: 1,
    approvalRequired: true,
    approvedForAutonomousExecution: false,
    reviewer:
      'Governance Office'
  }
}

fs.rmSync(
  workspaceRoot,
  {
    recursive: true,
    force: true
  }
)

try {
  assert.ok(
    provenance.repositoryRoot
  )

  assert.ok(
    provenance.branch
  )

  assert.ok(
    provenance.commit
  )

  console.log(
    'PASS canonical repository provenance captured'
  )

  assert.equal(
    isGovernedWorkspacePath(
      workspaceRoot,
      provenance.repositoryRoot
    ),
    true
  )

  assert.equal(
    isGovernedWorkspacePath(
      provenance.repositoryRoot,
      provenance.repositoryRoot
    ),
    false
  )

  console.log(
    'PASS governed workspace boundary enforced'
  )

  const result =
    applyEngineeringPackageToWorkspace(
      engineeringPackage
    )

  assert.equal(
    result.success,
    true
  )

  assert.equal(
    result.status,
    'Workspace Built'
  )

  console.log(
    'PASS engineering workspace created from immutable source commit'
  )

  assert.equal(
    fs.existsSync(
      path.join(
        workspaceRoot,
        'package.json'
      )
    ),
    true
  )

  assert.equal(
    fs.existsSync(
      path.join(
        workspaceRoot,
        'backend',
        'package.json'
      )
    ),
    true
  )

  console.log(
    'PASS canonical EOS source snapshot present in workspace'
  )

  assert.equal(
    fs.existsSync(
      path.join(
        workspaceRoot,
        '.git'
      )
    ),
    false
  )

  console.log(
    'PASS canonical Git metadata excluded from workspace'
  )

  assert.equal(
    fs.existsSync(
      path.join(
        workspaceRoot,
        'proof',
        'workspace-proof.js'
      )
    ),
    true
  )

  assert.equal(
    fs.existsSync(
      path.join(
        workspaceRoot,
        GOVERNED_WORKSPACE_MANIFEST
      )
    ),
    true
  )

  console.log(
    'PASS engineering changes and workspace manifest created'
  )

  const manifest =
    readGovernedWorkspaceManifest(
      workspaceRoot,
      provenance.repositoryRoot
    )

  assert.ok(manifest)

  assert.equal(
    manifest.schemaVersion,
    '1.1.0'
  )

  assert.equal(
    manifest.source.commit,
    provenance.commit
  )

  assert.equal(
    manifest.source.branch,
    provenance.branch
  )

  assert.equal(
    manifest.source.snapshotType,
    'git-archive'
  )

  assert.equal(
    manifest.source.immutableSource,
    true
  )

  assert.equal(
    manifest.isolation.canonicalRepositoryWritable,
    false
  )

  assert.equal(
    manifest.isolation.directCommitAllowed,
    false
  )

  assert.equal(
    manifest.isolation.gitMetadataIncluded,
    false
  )

  console.log(
    'PASS workspace source provenance and isolation manifest verified'
  )

  const canonicalPackageAfter =
    fs.readFileSync(
      canonicalPackageFile,
      'utf8'
    )

  assert.equal(
    canonicalPackageAfter,
    canonicalPackageBefore
  )

  assert.equal(
    fs.existsSync(
      path.join(
        provenance.repositoryRoot,
        'proof',
        'workspace-proof.js'
      )
    ),
    false
  )

  console.log(
    'PASS canonical repository remains unchanged by workspace build'
  )

  const escapedWorkspace =
    applyEngineeringPackageToWorkspace(
      engineeringPackage,
      {
        workspaceRoot:
          path.join(
            provenance.repositoryRoot,
            'unsafe-workspace'
          )
      }
    )

  assert.equal(
    escapedWorkspace.success,
    false
  )

  console.log(
    'PASS workspace outside governed root rejected'
  )

  const unsafePackage = {
    ...engineeringPackage,

    packageId:
      `${packageId}-UNSAFE`,

    files: [
      {
        path:
          '../../canonical-write.txt',

        action:
          'create',

        language:
          'text',

        content:
          'unsafe',

        reason:
          'Path traversal test.'
      }
    ]
  }

  const unsafeResult =
    applyEngineeringPackageToWorkspace(
      unsafePackage
    )

  assert.equal(
    unsafeResult.success,
    false
  )

  assert.match(
    unsafeResult.errors.join(' '),
    /Unsafe workspace path/
  )

  assert.equal(
    fs.existsSync(
      path.join(
        provenance.repositoryRoot,
        'canonical-write.txt'
      )
    ),
    false
  )

  console.log(
    'PASS path traversal cannot modify canonical repository'
  )

  console.log(
    'All Objective 10.5.2 governed engineering workspace tests passed.'
  )
} finally {
  fs.rmSync(
    workspaceRoot,
    {
      recursive: true,
      force: true
    }
  )

  fs.rmSync(
    path.join(
      governedRoot,
      `${packageId}-UNSAFE`
    ),
    {
      recursive: true,
      force: true
    }
  )
}
