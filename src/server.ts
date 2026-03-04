import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';

const PORT = env.PORT || 5000;

async function startServer() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  });
}

startServer();
