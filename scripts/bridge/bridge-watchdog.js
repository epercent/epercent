import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function inspectHeartbeat({ stateDir, now = Date.now(), staleMs = 45_000 }) {
  const heartbeat = JSON.parse(await readFile(join(stateDir, 'heartbeat.json'), 'utf8'));
  const ageMs = now - Date.parse(heartbeat.at);
  const executionDeadlineMs = Date.parse(heartbeat.executionDeadline ?? '');
  const executionLeaseActive =
    heartbeat.state === 'EXECUTING' &&
    Number.isFinite(executionDeadlineMs) &&
    now <= executionDeadlineMs;
  const heartbeatCurrent =
    Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= staleMs;
  return {
    healthy: heartbeatCurrent || executionLeaseActive,
    ageMs,
    heartbeat,
    executionLeaseActive
  };
}

export async function freezeOnStale({ stateDir, now, staleMs }) {
  const result = await inspectHeartbeat({ stateDir, now, staleMs });
  return Object.freeze({
    ...result,
    operationalFailure: !result.healthy,
    freezeRequested: false
  });
}
