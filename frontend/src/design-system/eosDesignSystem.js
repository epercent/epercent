export const eosTooltips = {
  activeExecutives:
    'Active executives are the human and AI leadership roles currently represented in the Digital Enterprise Headquarters.',
  attentionLevel:
    'Attention level signals how urgently an executive decision, review, or intervention may be needed.',
  capability:
    'A capability is a governed EOS platform increment with documentation, verification, registry links, and completion reports.',
  departmentHealth:
    'Department health combines operational condition, delivery progress, open risks, and attention needs for an executive function.',
  digitalTwinAsset:
    'A Digital Twin Asset is a governed digital representation of enterprise value, state, ownership, and operating activity.',
  enterpriseObject:
    'An Enterprise Object is a live EOS record for a capability, service, asset, agent, workflow, or governance construct.',
  event:
    'An event records that meaningful platform activity occurred and links operational history to workflows and objects.',
  healthScore:
    'Health score summarizes whether a platform area is stable, progressing, and operating within executive expectations.',
  investorReadiness:
    'Investor readiness measures whether a screen or asset can support credible board, investor, or strategic-partner conversations.',
  knowledgeObject:
    'A Knowledge Object is a governed research, documentation, publication, decision, or intellectual-property asset.',
  lifecycleStatus:
    'Lifecycle status shows where an item sits in its creation, review, approval, or publication journey.',
  milestone:
    'A milestone is a roadmap checkpoint that confirms meaningful progress toward EOS platform maturity.',
  operationalStatus:
    'Operational status communicates current health using executive color language: Green, Amber, Red, Blue, or Grey.',
  program:
    'A program groups capabilities, milestones, owners, dependencies, and business outcomes into one managed initiative.',
  progress:
    'Progress shows how far an item has advanced toward its current objective or maturity target.',
  recommendedAction:
    'Recommended action identifies the next executive decision, review, or operating step that will move EOS forward.',
  risk:
    'Risk describes a condition that may affect delivery, trust, security, commercial readiness, or investor confidence.',
  secondBalanceSheet:
    'The Second Balance Sheet is the EOS framework for recognizing operational digital assets and enterprise value creation.',
  workflow:
    'A workflow is a governed sequence of EOS work steps, events, owners, and related Enterprise Objects.',
}

export const executiveFallbacks = {
  unavailable: 'Awaiting Live Signal',
  unknown: 'Pending Assessment',
  noAction: 'No Action Required',
  notStarted: 'Not Started',
}

export function executiveValue(value, fallback = executiveFallbacks.unknown) {
  if (value === null || value === undefined || value === '' || value === 'None') {
    return fallback
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'Pending Assessment'
  }

  return value
}

export function executiveActionLabel(action, context = '') {
  const normalizedAction = String(action ?? '').toLowerCase()
  const normalizedContext = String(context ?? '').toLowerCase()

  if (normalizedAction.includes('open knowledge')) {
    return 'Review Knowledge Asset'
  }

  if (normalizedAction.includes('open workflow')) {
    return 'Review Workflow Status'
  }

  if (normalizedAction.includes('open object')) {
    return 'Inspect Enterprise Object'
  }

  if (normalizedAction.includes('assign task')) {
    return 'Prepare Executive Assignment'
  }

  if (normalizedAction.includes('request review')) {
    return 'Request Executive Review'
  }

  if (normalizedAction.includes('schedule meeting')) {
    return 'Prepare Review Session'
  }

  if (normalizedAction.includes('message executive')) {
    return 'Prepare Executive Briefing'
  }

  if (normalizedAction.includes('open office')) {
    return 'Open Executive Office'
  }

  if (normalizedAction.includes('view portfolio')) {
    return 'View Department Portfolio'
  }

  if (normalizedAction.includes('send message')) {
    return 'Prepare Executive Communication'
  }

  if (normalizedAction.includes('review work')) {
    return normalizedContext.includes('research') ? 'Review Research Portfolio' : 'Review Department Work'
  }

  if (normalizedContext.includes('white paper')) {
    return 'Review White Paper'
  }

  if (normalizedContext.includes('release')) {
    return 'Approve Release'
  }

  return executiveValue(action, 'Review Executive Brief')
}
