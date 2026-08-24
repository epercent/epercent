export function historyEvent({ type, generation, missionId, missionDigest, actor, outcome, at, evidenceId }) {
  if (!type || !at) throw new Error('history event requires type and timestamp');
  return Object.freeze({
    schemaVersion: '1.0.0', type, generation: generation ?? null,
    missionId: missionId ?? null, missionDigest: missionDigest ?? null,
    actor: actor ?? 'system', outcome: outcome ?? null,
    evidenceId: evidenceId ?? null, at
  });
}

export function appendHistory(existing, event, limit = 100) {
  const events = Array.isArray(existing) ? existing : [];
  const key = [event.type, event.generation, event.missionDigest, event.at].join(':');
  if (events.some((item) => [item.type, item.generation, item.missionDigest, item.at].join(':') === key)) return events;
  return [...events, event].slice(-limit);
}
