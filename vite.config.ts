import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// VITE_BASE_PATH is set by chat-service dev server for proxy routing.
// For production builds it defaults to '/'.
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    // Cosmos config injection plugin (inline)
    {
      name: 'cosmos-config',
      transformIndexHtml(html) {
        const config = {
          appKey: 'app_d4347e7d9867',
          graphKey: 'test',
          apiBaseUrl: '/api',
          environment: 'dev',
        };
        const script = `<script>window.__COSMOS_APP_CONFIG__=${JSON.stringify(config)}</script>`;
        return html.replace('</head>', script + '</head>');
      },
    },
  ],
  resolve: {
    alias: {
      '@app-helpers': path.resolve(__dirname, 'src/helpers.ts'),
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: false, // Disabled - frontend uses polling auto-refresh
  },
});
