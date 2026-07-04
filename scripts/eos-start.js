import {
  apiStatusUrl,
  backendDir,
  backendUrl,
  ensureRuntimeDir,
  fetchJson,
  frontendDir,
  frontendUrl,
  isProcessRunning,
  readRuntime,
  runtimeDir,
  spawnManagedProcess,
  waitForUrl,
  writeRuntime
} from './eos-common.js';

await ensureRuntimeDir();

const existingRuntime = await readRuntime();

if (
  existingRuntime &&
  isProcessRunning(existingRuntime.backend?.pid) &&
  isProcessRunning(existingRuntime.frontend?.pid)
) {
  console.log('EOS is already running.');
  const status = await fetchJson(apiStatusUrl).catch(() => null);
  console.log(`Backend: ${backendUrl}`);
  console.log(`Mission Control: ${frontendUrl}`);
  console.log(`Build Version: ${status?.version ?? 'unknown'}`);
  process.exit(0);
}

const backend = spawnManagedProcess(
  'EOS Core API',
  backendDir,
  ['run', 'start'],
  `${runtimeDir}/backend.log`,
  {
    HOST: '127.0.0.1',
    PORT: '3000'
  }
);

const frontend = spawnManagedProcess(
  'Mission Control',
  frontendDir,
  ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
  `${runtimeDir}/frontend.log`
);

const runtime = {
  startedAt: new Date().toISOString(),
  backend: {
    ...backend,
    url: backendUrl,
    healthUrl: apiStatusUrl
  },
  frontend: {
    ...frontend,
    url: frontendUrl
  }
};

await writeRuntime(runtime);

try {
  await waitForUrl(apiStatusUrl, 'EOS Core API');
  await waitForUrl(frontendUrl, 'Mission Control');
  const status = await fetchJson(apiStatusUrl);

  console.log('EOS started.');
  console.log(`Backend: ${backendUrl}`);
  console.log(`Mission Control: ${frontendUrl}`);
  console.log(`Build Version: ${status.version}`);
  console.log(`Runtime: ${runtimeDir}`);
} catch (error) {
  console.error(error.message);
  console.error(`Backend log: ${runtime.backend.logFile}`);
  console.error(`Frontend log: ${runtime.frontend.logFile}`);
  process.exit(1);
}
