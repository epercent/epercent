import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '3000';
const host = process.env.HOST ?? '127.0.0.1';
const requestHost = host === '0.0.0.0' ? '127.0.0.1' : host;
const baseUrl = `http://${requestHost}:${port}`;

const expectedStatus = {
  platform: 'EOS',
  version: '0.7.0',
  status: 'Operational',
  uptime: 'Running',
  activeAgents: 7
};

const expectedObjectIds = [
  'EOS-MC-001',
  'EOS-API-001',
  'EOS-CAP-0005',
  'EOS-CAP-0006',
  'EOS-CAP-0007',
  'EOS-CAP-0008',
  'EOS-CAP-0009',
  'EOS-CAP-0010',
  'EOS-CAP-0011',
  'EOS-ORG-DIR-001',
  'EOS-ORG-DIR-002',
  'EOS-EXEC-LEADERSHIP-TEAM',
  'EOS-KNOWLEDGE-GENESIS',
  'EOS-KNOWLEDGE-MISSION-CONTROL',
  'EOS-KNOWLEDGE-CORE-API',
  'EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY',
  'EOS-KNOWLEDGE-AGENT-SERVICE',
  'EOS-WF-RESEARCH-PUBLICATION',
  'EOS-WF-OPPORTUNITY-DISCOVERY',
  'EOS-WF-DIGITAL-TWIN-FORMATION',
  'EOS-WF-KNOWLEDGE-UPDATE',
  'EOS-WF-AGENT-COORDINATION',
  'EOS-WF-DEVELOPMENT-FOUNDATION',
  'EOS-WF-BACKUP-RECOVERY',
  'EOS-WF-SOURCE-CONTROL-RELEASE',
  'EOS-WF-INITIAL-REPOSITORY-BASELINE',
  'EOS-AGENT-ATHENA',
  'EOS-AGENT-HERMES',
  'EOS-AGENT-ATLAS',
  'EOS-AGENT-CODEX',
  'EOS-AGENT-MERCURY',
  'EOS-AGENT-ARGUS',
  'EOS-AGENT-VULCAN'
];

const expectedAgentIds = [
  'EOS-AGENT-ATHENA',
  'EOS-AGENT-HERMES',
  'EOS-AGENT-ATLAS',
  'EOS-AGENT-CODEX',
  'EOS-AGENT-MERCURY',
  'EOS-AGENT-ARGUS',
  'EOS-AGENT-VULCAN'
];

const expectedExecutiveAgentRoles = {
  'EOS-AGENT-ATHENA': 'Chief Research Officer',
  'EOS-AGENT-HERMES': 'Chief Knowledge Officer',
  'EOS-AGENT-ATLAS': 'Chief Enterprise Architect',
  'EOS-AGENT-CODEX': 'Chief Engineering Officer',
  'EOS-AGENT-MERCURY': 'Chief Opportunity Officer',
  'EOS-AGENT-ARGUS': 'Chief Operations Officer',
  'EOS-AGENT-VULCAN': 'Chief Quality Officer'
};

const expectedKnowledgeIds = [
  'EOS-KNOWLEDGE-GENESIS',
  'EOS-KNOWLEDGE-MISSION-CONTROL',
  'EOS-KNOWLEDGE-CORE-API',
  'EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY',
  'EOS-KNOWLEDGE-AGENT-SERVICE'
];

const expectedWorkflowIds = [
  'EOS-WF-RESEARCH-PUBLICATION',
  'EOS-WF-KNOWLEDGE-UPDATE',
  'EOS-WF-AGENT-COORDINATION',
  'EOS-WF-OPPORTUNITY-DISCOVERY',
  'EOS-WF-DIGITAL-TWIN-FORMATION',
  'EOS-WF-DEVELOPMENT-FOUNDATION',
  'EOS-WF-BACKUP-RECOVERY',
  'EOS-WF-SOURCE-CONTROL-RELEASE',
  'EOS-WF-INITIAL-REPOSITORY-BASELINE'
];

const expectedEventTypes = [
  'WORKFLOW_STARTED',
  'WORKFLOW_COMPLETED',
  'AGENT_STARTED',
  'AGENT_COMPLETED',
  'KNOWLEDGE_UPDATED',
  'OBJECT_CREATED'
];

const expectedEventIds = [
  'EOS-EVENT-RESEARCH-PUBLICATION-STARTED',
  'EOS-EVENT-RESEARCH-PUBLICATION-AGENT-STARTED',
  'EOS-EVENT-KNOWLEDGE-UPDATE-STARTED',
  'EOS-EVENT-KNOWLEDGE-UPDATED',
  'EOS-EVENT-AGENT-COORDINATION-STARTED',
  'EOS-EVENT-AGENT-COORDINATION-COMPLETED',
  'EOS-EVENT-OPPORTUNITY-DISCOVERY-STARTED',
  'EOS-EVENT-OPPORTUNITY-DISCOVERY-COMPLETED',
  'EOS-EVENT-DIGITAL-TWIN-FORMATION-STARTED',
  'EOS-EVENT-DIGITAL-TWIN-OBJECT-CREATED',
  'EOS-EVENT-DEVELOPMENT-FOUNDATION-STARTED',
  'EOS-EVENT-DEVELOPMENT-FOUNDATION-COMPLETED',
  'EOS-EVENT-BACKUP-RECOVERY-STARTED',
  'EOS-EVENT-BACKUP-ARCHIVE-CREATED',
  'EOS-EVENT-BACKUP-RECOVERY-COMPLETED',
  'EOS-EVENT-SOURCE-CONTROL-RELEASE-STARTED',
  'EOS-EVENT-RELEASE-MANIFEST-CREATED',
  'EOS-EVENT-SOURCE-CONTROL-RELEASE-COMPLETED',
  'EOS-EVENT-INITIAL-BASELINE-STARTED',
  'EOS-EVENT-GENESIS-COMMIT-CREATED',
  'EOS-EVENT-LOCAL-RELEASE-TAG-CREATED',
  'EOS-EVENT-INITIAL-BASELINE-COMPLETED'
];

const requiredObjectFields = [
  'id',
  'name',
  'type',
  'status',
  'owner',
  'layer',
  'version',
  'description',
  'linkedObjects'
];

const requiredAgentFields = [
  'id',
  'name',
  'role',
  'status',
  'currentTask',
  'progress',
  'health',
  'lastUpdate',
  'capabilities',
  'department',
  'reportsTo',
  'responsibilities',
  'executiveMetadata'
];

const requiredKnowledgeFields = [
  'id',
  'title',
  'category',
  'status',
  'owner',
  'version',
  'summary',
  'lastUpdate',
  'linkedObjects'
];

const requiredWorkflowFields = [
  'id',
  'name',
  'description',
  'status',
  'steps',
  'owner',
  'currentStep',
  'progress',
  'linkedObjects',
  'trigger',
  'lastRun',
  'events'
];

const requiredEventFields = [
  'id',
  'type',
  'sourceWorkflowId',
  'status',
  'emittedAt',
  'payload'
];

const server = spawn(process.execPath, ['src/server.js'], {
  cwd: new URL('..', import.meta.url),
  env: {
    ...process.env,
    HOST: host,
    PORT: port
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverOutput = '';

server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

const serverExit = new Promise((resolve) => {
  server.on('exit', (code, signal) => {
    resolve({ code, signal });
  });
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(path) {
  const url = `${baseUrl}${path}`;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited before responding. Output: ${serverOutput.trim()}`);
    }

    try {
      const response = await fetch(url);
      const body = await response.json();

      return { body, response, url };
    } catch {
      await wait(150);
    }
  }

  throw new Error(`Could not reach ${url}`);
}

function assertOk({ response, url }) {
  if (!response.ok) {
    throw new Error(`Expected 2xx response from ${url}, received ${response.status}`);
  }
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} mismatch. Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function assertEnterpriseObject(enterpriseObject) {
  for (const field of requiredObjectFields) {
    if (!(field in enterpriseObject)) {
      throw new Error(`Enterprise Object ${enterpriseObject.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(enterpriseObject.linkedObjects)) {
    throw new Error(`Enterprise Object ${enterpriseObject.id} linkedObjects must be an array`);
  }
}

function assertAgent(agent) {
  for (const field of requiredAgentFields) {
    if (!(field in agent)) {
      throw new Error(`Agent ${agent.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Number.isInteger(agent.progress) || agent.progress < 0 || agent.progress > 100) {
    throw new Error(`Agent ${agent.id} progress must be an integer from 0 to 100`);
  }

  if (!Array.isArray(agent.capabilities)) {
    throw new Error(`Agent ${agent.id} capabilities must be an array`);
  }

  if (agent.reportsTo !== 'Chief Technology Officer') {
    throw new Error(`Agent ${agent.id} must report to the Chief Technology Officer`);
  }

  if (!Array.isArray(agent.responsibilities) || agent.responsibilities.length === 0) {
    throw new Error(`Agent ${agent.id} responsibilities must be a non-empty array`);
  }

  if (
    !agent.executiveMetadata ||
    agent.executiveMetadata.leadershipTeam !== 'EOS Executive Leadership Team' ||
    agent.executiveMetadata.reportingLine !== 'Chief Technology Officer'
  ) {
    throw new Error(`Agent ${agent.id} must include EOS Executive Leadership Team metadata`);
  }

  if (!Array.isArray(agent.executiveMetadata.directiveIds) || !agent.executiveMetadata.directiveIds.includes('EOS-ORG-DIR-002')) {
    throw new Error(`Agent ${agent.id} must reference EOS-ORG-DIR-002 in executive metadata`);
  }
}

function assertKnowledgeObject(knowledgeObject) {
  for (const field of requiredKnowledgeFields) {
    if (!(field in knowledgeObject)) {
      throw new Error(`Knowledge Object ${knowledgeObject.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(knowledgeObject.linkedObjects)) {
    throw new Error(`Knowledge Object ${knowledgeObject.id} linkedObjects must be an array`);
  }
}

function assertWorkflow(workflow) {
  for (const field of requiredWorkflowFields) {
    if (!(field in workflow)) {
      throw new Error(`Workflow ${workflow.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(workflow.steps) || workflow.steps.length === 0) {
    throw new Error(`Workflow ${workflow.id} steps must be a non-empty array`);
  }

  if (!Number.isInteger(workflow.progress) || workflow.progress < 0 || workflow.progress > 100) {
    throw new Error(`Workflow ${workflow.id} progress must be an integer from 0 to 100`);
  }

  if (!Array.isArray(workflow.linkedObjects)) {
    throw new Error(`Workflow ${workflow.id} linkedObjects must be an array`);
  }

  if (!Array.isArray(workflow.events) || workflow.events.length === 0) {
    throw new Error(`Workflow ${workflow.id} must emit at least one EOS Event`);
  }

  for (const event of workflow.events) {
    assertWorkflowEvent(event, workflow.id);
  }
}

function assertWorkflowEvent(event, workflowId) {
  for (const field of requiredEventFields) {
    if (!(field in event)) {
      throw new Error(`EOS Event ${event.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (event.sourceWorkflowId !== workflowId) {
    throw new Error(`EOS Event ${event.id} must be emitted by ${workflowId}`);
  }

  if (event.status !== 'Emitted') {
    throw new Error(`EOS Event ${event.id} must have Emitted status`);
  }
}

try {
  const statusResult = await Promise.race([
    requestJson('/api/status'),
    serverExit.then(({ code, signal }) => {
      throw new Error(
        `Server exited before responding with code ${code ?? 'null'} and signal ${signal ?? 'null'}. Output: ${serverOutput.trim()}`
      );
    })
  ]);

  assertOk(statusResult);
  assertEqual(statusResult.body, expectedStatus, 'Status payload');

  const objectsResult = await requestJson('/api/objects');
  assertOk(objectsResult);

  if (objectsResult.body.capability !== 'EOS-CAP-0003') {
    throw new Error(`Expected EOS-CAP-0003 capability, received ${objectsResult.body.capability}`);
  }

  if (objectsResult.body.count !== expectedObjectIds.length) {
    throw new Error(`Expected ${expectedObjectIds.length} Enterprise Objects, received ${objectsResult.body.count}`);
  }

  if (!Array.isArray(objectsResult.body.objects)) {
    throw new Error('/api/objects response must include an objects array');
  }

  for (const enterpriseObject of objectsResult.body.objects) {
    assertEnterpriseObject(enterpriseObject);
  }

  const actualObjectIds = objectsResult.body.objects.map((enterpriseObject) => enterpriseObject.id);
  assertEqual(actualObjectIds, expectedObjectIds, 'Enterprise Object ids');

  const objectsById = new Map(
    objectsResult.body.objects.map((enterpriseObject) => [enterpriseObject.id, enterpriseObject])
  );

  const agentCapabilityObject = objectsById.get('EOS-CAP-0005');
  if (!agentCapabilityObject || agentCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0005 must be registered as a Capability Enterprise Object');
  }

  const knowledgeCapabilityObject = objectsById.get('EOS-CAP-0006');
  if (!knowledgeCapabilityObject || knowledgeCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0006 must be registered as a Capability Enterprise Object');
  }

  const workflowCapabilityObject = objectsById.get('EOS-CAP-0007');
  if (!workflowCapabilityObject || workflowCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0007 must be registered as a Capability Enterprise Object');
  }

  const developmentFoundationObject = objectsById.get('EOS-CAP-0008');
  if (!developmentFoundationObject || developmentFoundationObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0008 must be registered as a Capability Enterprise Object');
  }

  const backupRecoveryObject = objectsById.get('EOS-CAP-0009');
  if (!backupRecoveryObject || backupRecoveryObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0009 must be registered as a Capability Enterprise Object');
  }

  const sourceControlReleaseObject = objectsById.get('EOS-CAP-0010');
  if (!sourceControlReleaseObject || sourceControlReleaseObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0010 must be registered as a Capability Enterprise Object');
  }

  if (!sourceControlReleaseObject.linkedObjects.includes('EOS-WF-SOURCE-CONTROL-RELEASE')) {
    throw new Error('EOS-CAP-0010 must link to EOS-WF-SOURCE-CONTROL-RELEASE');
  }

  const initialRepositoryBaselineObject = objectsById.get('EOS-CAP-0011');
  if (!initialRepositoryBaselineObject || initialRepositoryBaselineObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0011 must be registered as a Capability Enterprise Object');
  }

  if (!initialRepositoryBaselineObject.linkedObjects.includes('EOS-WF-INITIAL-REPOSITORY-BASELINE')) {
    throw new Error('EOS-CAP-0011 must link to EOS-WF-INITIAL-REPOSITORY-BASELINE');
  }

  const codexDirectiveObject = objectsById.get('EOS-ORG-DIR-001');
  if (!codexDirectiveObject || codexDirectiveObject.type !== 'Directive') {
    throw new Error('EOS-ORG-DIR-001 must be registered as a Directive Enterprise Object');
  }

  if (!codexDirectiveObject.linkedObjects.includes('EOS-AGENT-CODEX')) {
    throw new Error('EOS-ORG-DIR-001 must link to EOS-AGENT-CODEX');
  }

  const executiveDirectiveObject = objectsById.get('EOS-ORG-DIR-002');
  if (!executiveDirectiveObject || executiveDirectiveObject.type !== 'Directive') {
    throw new Error('EOS-ORG-DIR-002 must be registered as a Directive Enterprise Object');
  }

  const executiveTeamObject = objectsById.get('EOS-EXEC-LEADERSHIP-TEAM');
  if (!executiveTeamObject || executiveTeamObject.type !== 'Organization') {
    throw new Error('EOS-EXEC-LEADERSHIP-TEAM must be registered as an Organization Enterprise Object');
  }

  for (const agentId of expectedAgentIds) {
    if (!executiveDirectiveObject.linkedObjects.includes(agentId)) {
      throw new Error(`EOS-ORG-DIR-002 must link to ${agentId}`);
    }

    if (!executiveTeamObject.linkedObjects.includes(agentId)) {
      throw new Error(`EOS-EXEC-LEADERSHIP-TEAM must link to ${agentId}`);
    }
  }

  for (const agentId of expectedAgentIds) {
    const agentObject = objectsById.get(agentId);

    if (!agentObject || agentObject.type !== 'Agent') {
      throw new Error(`${agentId} must be registered as an Agent Enterprise Object`);
    }

    if (!agentObject.linkedObjects.includes('EOS-CAP-0005')) {
      throw new Error(`${agentId} must link to EOS-CAP-0005`);
    }

    if (!agentObject.linkedObjects.includes('EOS-ORG-DIR-002')) {
      throw new Error(`${agentId} must link to EOS-ORG-DIR-002`);
    }

    if (!agentObject.linkedObjects.includes('EOS-EXEC-LEADERSHIP-TEAM')) {
      throw new Error(`${agentId} must link to EOS-EXEC-LEADERSHIP-TEAM`);
    }

    if (agentObject.reportsTo !== 'Chief Technology Officer') {
      throw new Error(`${agentId} Enterprise Object must report to the Chief Technology Officer`);
    }

    if (!Array.isArray(agentObject.responsibilities) || agentObject.responsibilities.length === 0) {
      throw new Error(`${agentId} Enterprise Object must include responsibilities`);
    }
  }

  for (const knowledgeId of expectedKnowledgeIds) {
    const knowledgeEnterpriseObject = objectsById.get(knowledgeId);

    if (!knowledgeEnterpriseObject || knowledgeEnterpriseObject.type !== 'Knowledge Object') {
      throw new Error(`${knowledgeId} must be registered as a Knowledge Object Enterprise Object`);
    }

    if (!knowledgeEnterpriseObject.linkedObjects.includes('EOS-CAP-0006')) {
      throw new Error(`${knowledgeId} must link to EOS-CAP-0006`);
    }
  }

  for (const workflowId of expectedWorkflowIds) {
    const workflowEnterpriseObject = objectsById.get(workflowId);

    if (!workflowEnterpriseObject || workflowEnterpriseObject.type !== 'Workflow') {
      throw new Error(`${workflowId} must be registered as a Workflow Enterprise Object`);
    }

    if (!workflowEnterpriseObject.linkedObjects.includes('EOS-CAP-0007')) {
      throw new Error(`${workflowId} must link to EOS-CAP-0007`);
    }
  }

  const objectResult = await requestJson('/api/objects/EOS-API-001');
  assertOk(objectResult);
  assertEnterpriseObject(objectResult.body);
  assertEqual(objectResult.body.id, 'EOS-API-001', 'Enterprise Object lookup id');

  const agentsResult = await requestJson('/api/agents');
  assertOk(agentsResult);

  if (agentsResult.body.capability !== 'EOS-CAP-0005') {
    throw new Error(`Expected EOS-CAP-0005 capability, received ${agentsResult.body.capability}`);
  }

  if (agentsResult.body.count !== expectedAgentIds.length) {
    throw new Error(`Expected ${expectedAgentIds.length} agents, received ${agentsResult.body.count}`);
  }

  if (!Array.isArray(agentsResult.body.agents)) {
    throw new Error('/api/agents response must include an agents array');
  }

  for (const agent of agentsResult.body.agents) {
    assertAgent(agent);
  }

  const actualAgentIds = agentsResult.body.agents.map((agent) => agent.id);
  assertEqual(actualAgentIds, expectedAgentIds, 'Agent ids');

  const agentResult = await requestJson('/api/agents/EOS-AGENT-ATHENA');
  assertOk(agentResult);
  assertAgent(agentResult.body);
  assertEqual(agentResult.body.id, 'EOS-AGENT-ATHENA', 'Agent lookup id');

  for (const [agentId, role] of Object.entries(expectedExecutiveAgentRoles)) {
    const executiveAgent = agentsResult.body.agents.find((agent) => agent.id === agentId);
    if (!executiveAgent || executiveAgent.role !== role) {
      throw new Error(`${agentId} must be registered as ${role}`);
    }

    const executiveAgentResult = await requestJson(`/api/agents/${agentId}`);
    assertOk(executiveAgentResult);
    assertAgent(executiveAgentResult.body);
    assertEqual(executiveAgentResult.body.id, agentId, `${agentId} lookup id`);
  }

  const knowledgeResult = await requestJson('/api/knowledge');
  assertOk(knowledgeResult);

  if (knowledgeResult.body.capability !== 'EOS-CAP-0006') {
    throw new Error(`Expected EOS-CAP-0006 capability, received ${knowledgeResult.body.capability}`);
  }

  if (knowledgeResult.body.count !== expectedKnowledgeIds.length) {
    throw new Error(`Expected ${expectedKnowledgeIds.length} Knowledge Objects, received ${knowledgeResult.body.count}`);
  }

  if (!Array.isArray(knowledgeResult.body.knowledge)) {
    throw new Error('/api/knowledge response must include a knowledge array');
  }

  for (const knowledgeObject of knowledgeResult.body.knowledge) {
    assertKnowledgeObject(knowledgeObject);
  }

  const actualKnowledgeIds = knowledgeResult.body.knowledge.map((knowledgeObject) => knowledgeObject.id);
  assertEqual(actualKnowledgeIds, expectedKnowledgeIds, 'Knowledge Object ids');

  const knowledgeLookupResult = await requestJson('/api/knowledge/EOS-KNOWLEDGE-GENESIS');
  assertOk(knowledgeLookupResult);
  assertKnowledgeObject(knowledgeLookupResult.body);
  assertEqual(knowledgeLookupResult.body.id, 'EOS-KNOWLEDGE-GENESIS', 'Knowledge Object lookup id');

  const workflowsResult = await requestJson('/api/workflows');
  assertOk(workflowsResult);

  if (workflowsResult.body.capability !== 'EOS-CAP-0007') {
    throw new Error(`Expected EOS-CAP-0007 capability, received ${workflowsResult.body.capability}`);
  }

  if (workflowsResult.body.eventModel !== 'EOS Events') {
    throw new Error(`Expected EOS Events event model, received ${workflowsResult.body.eventModel}`);
  }

  assertEqual(workflowsResult.body.eventTypes, expectedEventTypes, 'Workflow event types');

  if (workflowsResult.body.count !== expectedWorkflowIds.length) {
    throw new Error(`Expected ${expectedWorkflowIds.length} workflows, received ${workflowsResult.body.count}`);
  }

  if (!Array.isArray(workflowsResult.body.workflows)) {
    throw new Error('/api/workflows response must include a workflows array');
  }

  for (const workflow of workflowsResult.body.workflows) {
    assertWorkflow(workflow);
  }

  const actualWorkflowIds = workflowsResult.body.workflows.map((workflow) => workflow.id);
  assertEqual(actualWorkflowIds, expectedWorkflowIds, 'Workflow ids');

  const workflowLookupResult = await requestJson('/api/workflows/EOS-WF-RESEARCH-PUBLICATION');
  assertOk(workflowLookupResult);
  assertWorkflow(workflowLookupResult.body);
  assertEqual(workflowLookupResult.body.id, 'EOS-WF-RESEARCH-PUBLICATION', 'Workflow lookup id');

  const eventsResult = await requestJson('/api/events');
  assertOk(eventsResult);

  if (eventsResult.body.capability !== 'EOS-CAP-0007') {
    throw new Error(`Expected EOS-CAP-0007 capability, received ${eventsResult.body.capability}`);
  }

  if (eventsResult.body.eventModel !== 'EOS Events') {
    throw new Error(`Expected EOS Events event model, received ${eventsResult.body.eventModel}`);
  }

  assertEqual(eventsResult.body.eventTypes, expectedEventTypes, 'EOS Event types');

  if (eventsResult.body.count !== expectedEventIds.length) {
    throw new Error(`Expected ${expectedEventIds.length} EOS Events, received ${eventsResult.body.count}`);
  }

  if (!Array.isArray(eventsResult.body.events)) {
    throw new Error('/api/events response must include an events array');
  }

  const actualEventIds = eventsResult.body.events.map((event) => event.id);
  assertEqual(actualEventIds, expectedEventIds, 'EOS Event ids');

  for (const event of eventsResult.body.events) {
    if (!expectedEventTypes.includes(event.type)) {
      throw new Error(`Unexpected EOS Event type ${event.type}`);
    }

    assertWorkflowEvent(event, event.sourceWorkflowId);
  }

  const actualEventTypes = new Set(eventsResult.body.events.map((event) => event.type));

  for (const eventType of expectedEventTypes) {
    if (!actualEventTypes.has(eventType)) {
      throw new Error(`Expected at least one emitted EOS Event of type ${eventType}`);
    }
  }

  const eventLookupResult = await requestJson('/api/events/EOS-EVENT-RESEARCH-PUBLICATION-STARTED');
  assertOk(eventLookupResult);
  assertWorkflowEvent(eventLookupResult.body, 'EOS-WF-RESEARCH-PUBLICATION');
  assertEqual(eventLookupResult.body.id, 'EOS-EVENT-RESEARCH-PUBLICATION-STARTED', 'EOS Event lookup id');

  console.log(
    `EOS Core API checks passed: ${baseUrl}/api/status, ${baseUrl}/api/objects, ${baseUrl}/api/agents, ${baseUrl}/api/knowledge, ${baseUrl}/api/workflows, and ${baseUrl}/api/events`
  );
} finally {
  server.kill('SIGTERM');
}

await serverExit;

if (serverOutput.trim()) {
  console.log(serverOutput.trim());
}
