import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/db.js';
import https from 'https';

const PORT = env.PORT || 5000;

// Render spins down free-tier instances after 15 minutes of inactivity.
// Pinging our own public URL every 14 minutes keeps it awake.
const pingRenderUrl = () => {
  const url = 'https://lms-backednd.onrender.com/api/health';
  https.get(url, (res) => {
    // Silently ping
  }).on('error', (err) => {
    // Silently handle error
  });
};

async function startServer() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
    
    // Start self-pinging every 14 minutes (14 * 60 * 1000 ms)
    if (env.NODE_ENV === 'production') {
      setInterval(pingRenderUrl, 14 * 60 * 1000);
      console.log('[KeepAlive] Backend self-ping routine started.');
    }
  });
}

startServer();
