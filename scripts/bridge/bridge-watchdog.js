import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function inspectHeartbeat({ stateDir, now = Date.now(), staleMs = 45_000 }) {
  const heartbeat = JSON.parse(await readFile(join(stateDir, 'heartbeat.json'), 'utf8'));
  const ageMs = now - Date.parse(heartbeat.at);
  return { healthy: Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= staleMs, ageMs, heartbeat };
}

export async function freezeOnStale({ stateDir, now, staleMs }) {
  const result = await inspectHeartbeat({ stateDir, now, staleMs });
  if (!result.healthy) {
    await writeFile(join(stateDir, 'FROZEN'), 'watchdog stale heartbeat\n', { mode: 0o600 });
  }
  return result;
}
