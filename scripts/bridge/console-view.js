export function renderConsole(model) {
  const rows = [
    'eOS GOVERNED BRIDGE — LIVE CONSOLE',
    '==================================',
    'State: ' + model.state,
    'Mission: ' + (model.missionId || 'none'),
    'Digest: ' + (model.missionDigest || 'none'),
    'Branch: ' + (model.branch || 'unknown'),
    'Commit: ' + (model.headCommit || 'unknown'),
    'Repository: ' + (model.repositoryClean ? 'clean' : 'changed'),
    'Bridge: ' + (model.bridgeHealthy ? 'healthy' : 'degraded'),
    'Watchdog: ' + (model.watchdogHealthy ? 'healthy' : 'degraded'),
    'Frozen: ' + (model.frozen ? 'YES' : 'no'),
    'Approval: ' + (model.approvalRequired ? 'REQUIRED — open ' + model.approvalUrl : 'not required'),
    '',
    'Recent governed events:'
  ];
  for (const event of model.events || []) rows.push('- ' + event.at + ' ' + event.message);
  return rows.join('\n') + '\n';
}

export function renderAnsiFrame(model) {
  const colors = {
    IDLE: '\u001b[36m', VALIDATING: '\u001b[36m', AWAITING_APPROVAL: '\u001b[33m',
    APPROVED: '\u001b[34m', EXECUTING: '\u001b[35m', COMPLETED: '\u001b[32m',
    REJECTED: '\u001b[31m', PAUSED: '\u001b[33m', FROZEN: '\u001b[31;1m',
    DEGRADED: '\u001b[33;1m', QUARANTINED: '\u001b[31;1m'
  };
  const reset = '\u001b[0m';
  const frame = renderConsole(model).replace(
    'State: ' + model.state,
    'State: ' + (colors[model.state] ?? '') + model.state + reset
  );
  return '\u001b[2J\u001b[H' + frame;
}
