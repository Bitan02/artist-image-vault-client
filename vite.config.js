import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'creative-showcase-backend-9w95snosy.vercel.app',
        changeOrigin: true,
      },
    },
  },
});

