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
  return '\u001b[2J\u001b[H' + renderConsole(model);
}
