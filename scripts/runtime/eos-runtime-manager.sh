#!/bin/bash

set -u

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

EOS_ROOT="$HOME/EOS/EOS/EOS"
RUNTIME_DIR="$EOS_ROOT/runtime"
LOG_DIR="$EOS_ROOT/logs"
STATUS_FILE="$RUNTIME_DIR/eos-runtime-status.json"
EOS_STATUS_FILE="/tmp/eos-machine-status.json"

mkdir -p "$RUNTIME_DIR" "$LOG_DIR"
cd "$EOS_ROOT" || exit 1

started_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
tailscale_ip="unavailable"
docker_status="not_checked"
git_status="not_checked"
node_status="not_checked"
npm_status="not_checked"

echo "===== EOS Runtime Manager ====="
echo "Started: $started_at"

if command -v node >/dev/null 2>&1; then
  node_status="$(node -v)"
else
  node_status="missing"
fi

if command -v npm >/dev/null 2>&1; then
  npm_status="$(npm -v)"
else
  npm_status="missing"
fi

if command -v git >/dev/null 2>&1; then
  git_status="$(git status --short | wc -l | tr -d ' ') uncommitted changes"
else
  git_status="missing"
fi

if command -v docker >/dev/null 2>&1; then
  if docker info >/dev/null 2>&1; then
    docker_status="running"
  else
    docker_status="installed_but_not_running"
  fi
else
  docker_status="missing"
fi

if [ -x "/Applications/Tailscale.app/Contents/MacOS/Tailscale" ]; then
  tailscale_ip="$(
    /Applications/Tailscale.app/Contents/MacOS/Tailscale ip -4 2>/dev/null \
      | head -1
  )"
elif command -v tailscale >/dev/null 2>&1; then
  tailscale_ip="$(tailscale ip -4 2>/dev/null | head -1)"
fi

if [ -z "$tailscale_ip" ]; then
  tailscale_ip="unavailable"
fi

if ! node scripts/eos-status.js --json > "$EOS_STATUS_FILE"; then
  echo "ERROR: EOS machine-readable health check failed."
  cat "$EOS_STATUS_FILE" 2>/dev/null || true
  exit 1
fi

node - "$EOS_STATUS_FILE" "$STATUS_FILE" "$started_at" "$tailscale_ip" \
  "$node_status" "$npm_status" "$git_status" "$docker_status" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [
  sourceFile,
  targetFile,
  checkedAt,
  tailscaleIp,
  nodeStatus,
  npmStatus,
  gitStatus,
  dockerStatus
] = process.argv.slice(2);

const eos = JSON.parse(readFileSync(sourceFile, 'utf8'));

const runtimeStatus = {
  runtime: 'EOS Runtime Manager v2',
  objective: '10.x.2',
  checked_at: checkedAt,
  eos_root: process.cwd(),
  healthy: eos.healthy,
  platform_status: eos.status,
  version: eos.version,
  checks: eos.checks,
  processes: eos.runtime,
  storage: eos.storage,
  backup: eos.backup,
  tailscale: {
    ip: tailscaleIp,
    available: tailscaleIp !== 'unavailable'
  },
  access: {
    backend_local: 'http://127.0.0.1:3000',
    mission_control_local: 'http://127.0.0.1:5173',
    backend_remote:
      tailscaleIp !== 'unavailable'
        ? `http://${tailscaleIp}:3000`
        : null,
    mission_control_remote:
      tailscaleIp !== 'unavailable'
        ? `http://${tailscaleIp}:5173`
        : null
  },
  host: {
    node: nodeStatus,
    npm: npmStatus,
    git: gitStatus,
    docker: dockerStatus
  }
};

writeFileSync(
  targetFile,
  `${JSON.stringify(runtimeStatus, null, 2)}\n`,
  'utf8'
);

if (!runtimeStatus.healthy) {
  process.exitCode = 1;
}
NODE

cat "$STATUS_FILE"

echo "EOS Runtime Manager Complete: $(date)"
