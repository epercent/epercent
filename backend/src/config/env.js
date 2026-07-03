const port = Number.parseInt(process.env.PORT ?? '3000', 10);

if (Number.isNaN(port)) {
  throw new Error('PORT must be a valid number');
}

export const env = {
  host: process.env.HOST ?? '0.0.0.0',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port
};
