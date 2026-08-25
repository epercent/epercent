import { randomBytes, randomUUID } from 'node:crypto';
import http from 'node:http';

import { assertLocalRequest } from './protocol.js';

function htmlEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

export function approvalPage(model, csrfToken, notice = null) {
  const mission = model.mission || {};
  const paths = (mission.allowedPaths || []).map((path) => '<li>' + htmlEscape(path) + '</li>').join('');
  const history = (model.history || []).slice(-10).reverse().map((event) =>
    '<tr><td>' + htmlEscape(event.at) + '</td><td>' + htmlEscape(event.type) +
    '</td><td>' + htmlEscape(event.missionId) + '</td><td>' + htmlEscape(event.outcome) + '</td></tr>'
  ).join('');
  const warning = model.warning ? '<p class="danger"><b>Attention:</b> ' + htmlEscape(model.warning) + '</p>' : '';
  const noticeHtml = notice?.message
    ? '<p class="notice ' + (notice.kind === 'success' ? 'success' : 'danger') + '">' + htmlEscape(notice.message) + '</p>'
    : '';
  const reset = ['FROZEN', 'QUARANTINED', 'DEGRADED'].includes(model.state)
    ? '<button name="decision" value="RESET">Governed recovery reset</button>' : '';
  return '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="5"><meta name="viewport" content="width=device-width">' +
    '<title>eOS Enterprise Control</title><style>:root{color-scheme:light dark}body{font:16px system-ui;max-width:1050px;margin:32px auto;padding:0 20px;line-height:1.45}' +
    'code{word-break:break-all}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.card{border:1px solid #8886;border-radius:10px;padding:14px}.state{display:inline-block;padding:5px 10px;border-radius:999px;font-weight:700}.s-IDLE,.s-COMPLETED{background:#167d3b;color:white}.s-EXECUTING,.s-APPROVED{background:#6246a8;color:white}.s-AWAITING_APPROVAL,.s-VALIDATING,.s-PAUSED{background:#a55b00;color:white}.s-FROZEN,.s-QUARANTINED,.s-DEGRADED,.s-REJECTED{background:#8d001d;color:white}' +
    'button{font-size:17px;padding:11px 20px;margin:4px 8px 4px 0}.danger{background:#8d001d;color:white;padding:10px}.success{background:#167d3b;color:white;padding:10px}.notice{border-radius:8px}table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:7px;border-bottom:1px solid #8885}</style></head><body>' +
    '<h1>eOS Enterprise Control</h1>' + noticeHtml + '<p><b>Bridge state:</b> <span class="state s-' + htmlEscape(model.state) + '">' + htmlEscape(model.state) + '</span></p>' + warning +
    '<h2>' + htmlEscape(mission.title || 'No mission awaiting approval') + '</h2>' +
    '<p>' + htmlEscape(mission.description || mission.objective || 'No active mission. The Bridge is monitoring EOS for the next governed proposal.') + '</p>' +
    '<div class="grid"><section class="card"><b>Mission</b><br>' + htmlEscape(mission.missionId || 'none') + '<br><b>Generation</b><br>' + htmlEscape(model.generation ?? 'none') + '<br><b>Risk / authority</b><br>' + htmlEscape(model.risk || 'not classified') + ' / ' + htmlEscape(mission.authorityLevel || 'none') + '</section>' +
    '<section class="card"><b>Branch</b><br>' + htmlEscape(mission.requiredBranch || model.branch || 'none') + '<br><b>Commit</b><br><code>' + htmlEscape(mission.requiredCommit || model.headCommit || 'none') + '</code><br><b>Repository</b><br>' + htmlEscape(model.repositoryClean === false ? 'changed' : 'clean') + '</section>' +
    '<section class="card"><b>Digest</b><br><code>' + htmlEscape(model.missionDigest || 'none') + '</code><br><b>Execution</b><br>' + htmlEscape(model.executionStatus || 'not started') + '<br><b>Policy / tests</b><br>' + htmlEscape(model.policyStatus || 'pending') + ' / ' + htmlEscape(model.testStatus || 'pending') + '<br><b>Recovery</b><br>' + htmlEscape(model.recoveryStatus || 'monitoring') + '</section></div>' +
    '<p><b>Command summary:</b> <code>' + htmlEscape(model.commandSummary || 'none') + '</code></p>' +
    '<p><b>Allowed paths:</b></p><ul>' + paths + '</ul>' +
    '<form method="post" action="/decision"><input type="hidden" name="csrf" value="' + htmlEscape(csrfToken) + '">' +
    '<button name="decision" value="APPROVE">Approve exact digest</button>' +
    '<button class="danger" name="decision" value="REJECT">Reject</button>' + reset + '</form>' +
    '<h2>Approval and execution history</h2><table><thead><tr><th>Time</th><th>Event</th><th>Mission</th><th>Outcome</th></tr></thead><tbody>' +
    history + '</tbody></table></body></html>';
}

function parseForm(body) {
  return Object.fromEntries(new URLSearchParams(body));
}

function redirectHome(response, message, kind) {
  response.statusCode = 303;
  response.setHeader('Location', '/?kind=' + encodeURIComponent(kind) + '&notice=' + encodeURIComponent(message));
  response.end();
}

export function createApprovalServer({ port = 4767, getModel, decide }) {
  const csrfToken = randomBytes(32).toString('hex');
  const expectedOrigin = 'http://127.0.0.1:' + port;
  const server = http.createServer(async (request, response) => {
    try {
      assertLocalRequest({ address: request.socket.remoteAddress, origin: request.headers.origin || expectedOrigin, expectedOrigin });
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");
      response.setHeader('X-Content-Type-Options', 'nosniff');
      const url = new URL(request.url, expectedOrigin);
      if (request.method === 'GET' && url.pathname === '/') {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        const notice = url.searchParams.get('notice');
        response.end(approvalPage(await getModel(), csrfToken, notice ? {
          message: notice, kind: url.searchParams.get('kind')
        } : null));
        return;
      }
      if (request.method === 'POST' && url.pathname === '/decision') {
        let body = '';
        for await (const chunk of request) {
          body += chunk;
          if (body.length > 8192) throw new Error('request too large');
        }
        const form = parseForm(body);
        if (form.csrf !== csrfToken) throw new Error('invalid CSRF token');
        if (!['APPROVE', 'REJECT', 'RESET'].includes(form.decision)) throw new Error('invalid decision');
        await decide({ decision: form.decision, requestId: randomUUID() });
        redirectHome(response, form.decision === 'RESET' ? 'Governed recovery reset recorded.' : form.decision === 'REJECT' ? 'Mission rejected.' : 'Exact mission digest approved.', 'success');
        return;
      }
      response.statusCode = 404; response.end('Not found');
    } catch (error) {
      if (request.method === 'POST') {
        redirectHome(response, 'Refused: ' + error.message, 'error');
      } else {
        response.statusCode = 403; response.end('Refused: ' + error.message);
      }
    }
  });
  return { server, port, origin: expectedOrigin };
}
