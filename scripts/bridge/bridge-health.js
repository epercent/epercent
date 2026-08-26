export const HEALTH_STATES = Object.freeze({
  HEALTHY: 'HEALTHY',
  RECOVERING: 'RECOVERING',
  DEGRADED: 'DEGRADED',
  PROTECTED_FREEZE: 'PROTECTED_FREEZE'
});

export function recoveryDisposition({ failure, attempts, maximumAttempts }) {
  if (failure.kind === 'PROTECTED') {
    return Object.freeze({
      health: HEALTH_STATES.PROTECTED_FREEZE,
      freeze: true,
      retry: false,
      reason: failure.message
    });
  }
  if (failure.recoverable && attempts < maximumAttempts) {
    return Object.freeze({
      health: HEALTH_STATES.RECOVERING,
      freeze: false,
      retry: true,
      reason: failure.message
    });
  }
  return Object.freeze({
    health: HEALTH_STATES.DEGRADED,
    freeze: false,
    retry: false,
    reason: failure.message
  });
}

export function executionHealthGate(checks) {
  const failures = Object.entries(checks)
    .filter(([, value]) => value !== true)
    .map(([name]) => name);
  return Object.freeze({
    healthy: failures.length === 0,
    failures,
    state: failures.length === 0 ? HEALTH_STATES.HEALTHY : HEALTH_STATES.DEGRADED
  });
}
