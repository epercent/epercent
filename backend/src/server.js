import 'dotenv/config';

import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.port, env.host, (error) => {
  if (error) {
    console.error('Failed to start EOS Core API:', error);
    process.exit(1);
  }

  console.log(`EOS Core API listening on ${env.host}:${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down EOS Core API.`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
