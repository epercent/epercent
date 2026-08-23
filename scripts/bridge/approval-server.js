import { randomBytes, randomUUID } from 'node:crypto';
import http from 'node:http';

import { assertLocalRequest } from './protocol.js';

function htmlEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

export function approvalPage(model, csrfToken) {
  const mission = model.mission || {};
  const paths = (mission.allowedPaths || []).map((path) => '<li>' + htmlEscape(path) + '</li>').join('');
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
    '<title>eOS Enterprise Control</title><style>body{font:16px system-ui;max-width:900px;margin:40px auto;padding:0 20px}' +
    'code{word-break:break-all}button{font-size:18px;padding:12px 22px;margin-right:10px}.danger{background:#7a0019;color:white}</style></head><body>' +
    '<h1>eOS Enterprise Control</h1><h2>' + htmlEscape(mission.title || 'No mission awaiting approval') + '</h2>' +
    '<p><b>Mission:</b> ' + htmlEscape(mission.missionId) + '</p><p><b>Digest:</b> <code>' + htmlEscape(model.missionDigest) + '</code></p>' +
    '<p><b>Branch:</b> ' + htmlEscape(mission.requiredBranch) + '</p><p><b>Commit:</b> <code>' + htmlEscape(mission.requiredCommit) + '</code></p>' +
    '<p><b>Allowed paths:</b></p><ul>' + paths + '</ul>' +
    '<form method="post" action="/decision"><input type="hidden" name="csrf" value="' + htmlEscape(csrfToken) + '">' +
    '<button name="decision" value="APPROVE">Approve exact digest</button>' +
    '<button class="danger" name="decision" value="REJECT">Reject</button></form></body></html>';
}

function parseForm(body) {
  return Object.fromEntries(new URLSearchParams(body));
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
      if (request.method === 'GET' && request.url === '/') {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(approvalPage(await getModel(), csrfToken));
        return;
      }
      if (request.method === 'POST' && request.url === '/decision') {
        let body = '';
        for await (const chunk of request) {
          body += chunk;
          if (body.length > 8192) throw new Error('request too large');
        }
        const form = parseForm(body);
        if (form.csrf !== csrfToken) throw new Error('invalid CSRF token');
        if (!['APPROVE', 'REJECT'].includes(form.decision)) throw new Error('invalid decision');
        await decide({ decision: form.decision, requestId: randomUUID() });
        response.statusCode = 303;
        response.setHeader('Location', '/');
        response.end();
        return;
      }
      response.statusCode = 404; response.end('Not found');
    } catch (error) {
      response.statusCode = 403; response.end('Refused: ' + error.message);
    }
  });
  return { server, port, origin: expectedOrigin };
}
