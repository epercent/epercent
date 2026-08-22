import { createHash } from 'node:crypto';

const catalog = Object.freeze({
  en: Object.freeze({
    heading: 'OPERATOR EXPLANATION',
    fallback: 'The requested language is unavailable. Using the safe English fallback.',
    none: 'none',
    yes: 'yes',
    no: 'no'
  })
});

const secretPatterns = [
  /GOCSPX-[A-Za-z0-9_-]+/gi,
  /ya29\.[A-Za-z0-9._-]+/gi,
  /1\/\/[A-Za-z0-9._-]+/g,
  /sk-[A-Za-z0-9_-]{16,}/gi,
  /Bearer\s+[A-Za-z0-9._~+\/-]+=*/gi,
  /(?:password|passwd|secret|token|api[_-]?key)\s*[=:]\s*[^\s,;]+/gi
];

export function resolveOperatorLanguage(requested = process.env.EOS_OPERATOR_LANGUAGE) {
  const normalized = typeof requested === 'string' ? requested.trim().toLowerCase() : '';
  const language = Object.hasOwn(catalog, normalized) ? normalized : 'en';
  return { language, requested: normalized || null, fellBack: Boolean(normalized && normalized !== language) };
}

export function redactOperatorText(value) {
  let text = String(value ?? '');
  for (const pattern of secretPatterns) text = text.replace(pattern, '[REDACTED]');
  return text;
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function missionDigest(mission) {
  return createHash('sha256').update(JSON.stringify(canonicalize(mission))).digest('hex');
}

export function classifyMissionImpact(mission) {
  const executable = mission?.command?.executable ?? 'unknown';
  const args = Array.isArray(mission?.command?.arguments) ? mission.command.arguments : [];
  const command = [executable, ...args].join(' ');
  const paths = Array.isArray(mission?.allowedPaths) ? mission.allowedPaths : [];
  const mutating = paths.length > 0;
  const external = /\b(git\s+push|rclone|deploy|publish|release)\b/i.test(command);
  const destructive = /\b(rm|delete|drop|destroy|reset\s+--hard|uninstall)\b/i.test(command);
  return { mutating, external, destructive, level: destructive ? 'DESTRUCTIVE' : external ? 'EXTERNAL' : mutating ? 'MUTATING' : 'READ_ONLY' };
}

export function buildOperatorExplanation({ phase, inbox, validation, language: requestedLanguage }) {
  const languageState = resolveOperatorLanguage(requestedLanguage);
  const mission = inbox?.mission ?? null;
  const digest = mission ? missionDigest(mission) : null;
  if (validation?.missionDigest && validation.missionDigest !== digest) {
    throw new Error('Operator explanation refused: validation digest does not match mission.');
  }
  const impact = classifyMissionImpact(mission);
  const command = mission?.command ? [mission.command.executable, ...(mission.command.arguments ?? [])].join(' ') : 'none';
  const lines = [
    'Lifecycle phase: ' + (phase ?? inbox?.state ?? 'UNKNOWN'),
    'Mission: ' + (mission?.missionId ?? 'none'),
    'Purpose: ' + (mission?.title ?? 'No mission is present.'),
    'Impact classification: ' + impact.level,
    'Command: ' + command,
    'Repository branch: ' + (mission?.requiredBranch ?? validation?.branch ?? 'none'),
    'Required commit: ' + (mission?.requiredCommit ?? 'none'),
    'Allowed paths: ' + ((mission?.allowedPaths ?? []).join(', ') || 'none'),
    'Execution permitted by proposal: ' + (mission?.executionPermitted === true ? 'yes' : 'no'),
    'Human authorization recorded: ' + (inbox?.authorization ? 'yes' : 'no'),
    'Executable now: ' + (validation?.executableNow === true ? 'yes' : 'no'),
    'Mission SHA-256: ' + (digest ?? 'none')
  ].map(redactOperatorText);
  if (languageState.fellBack) lines.unshift(catalog.en.fallback);
  return Object.freeze({ schemaVersion: '1.0.0', language: languageState.language, phase: phase ?? inbox?.state ?? 'UNKNOWN', missionId: mission?.missionId ?? null, missionDigest: digest, impact, lines });
}

export function formatOperatorExplanation(explanation) {
  const heading = (catalog[explanation.language]?.heading ?? catalog.en.heading) + ' (' + explanation.language + ')';
  return ['' , heading, '-'.repeat(heading.length), ...explanation.lines, ''].join('\n');
}

export function printOperatorExplanation(input, stream = process.stdout) {
  const explanation = buildOperatorExplanation(input);
  stream.write(formatOperatorExplanation(explanation) + '\n');
  return explanation;
}
