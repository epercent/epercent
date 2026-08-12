import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const rootDir = process.cwd()

console.log('Running Objective 10.x.2 managed runtime tests...')

const statusOutput = execFileSync(
  process.execPath,
  ['scripts/eos-status.js', '--json'],
  {
    cwd: rootDir,
    encoding: 'utf8'
  }
)

const status = JSON.parse(statusOutput)

assert.equal(status.platform, 'EOS')
assert.equal(status.status, 'Operational')
assert.equal(status.healthy, true)
assert.equal(status.checks.backend, true)
assert.equal(status.checks.frontend, true)
assert.equal(status.checks.api, true)
assert.equal(status.checks.missionControl, true)
assert.equal(status.checks.storage, true)

console.log('PASS machine-readable EOS status')

execFileSync(
  'bash',
  ['scripts/runtime/eos-runtime-manager.sh'],
  {
    cwd: rootDir,
    stdio: 'ignore'
  }
)

const runtimeStatus = JSON.parse(
  readFileSync(
    join(rootDir, 'runtime', 'eos-runtime-status.json'),
    'utf8'
  )
)

assert.equal(runtimeStatus.runtime, 'EOS Runtime Manager v2')
assert.equal(runtimeStatus.objective, '10.x.2')
assert.equal(runtimeStatus.healthy, true)
assert.equal(runtimeStatus.checks.backend, true)
assert.equal(runtimeStatus.checks.frontend, true)
assert.equal(runtimeStatus.checks.api, true)
assert.equal(runtimeStatus.checks.missionControl, true)
assert.equal(runtimeStatus.checks.storage, true)
assert.equal(runtimeStatus.tailscale.available, true)

console.log('PASS runtime manager structured health output')
console.log('All Objective 10.x.2 managed runtime tests passed.')
