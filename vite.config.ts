import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/simpli': {
        target: process.env.VITE_SIMPLI_API_URL || 'https://simplisaloncloud.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/simpli/, ''),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
});
