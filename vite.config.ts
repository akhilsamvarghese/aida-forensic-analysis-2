import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/upload': {
          target: 'http://167.71.237.172:5006',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/upload/, '')
        },
        '/plot_app': {
          target: 'http://167.71.237.172:5006',
          changeOrigin: true,
          secure: false,
        },
        '/dji': {
          target: 'http://localhost:60802/',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/dji/, '')
        },
        '/fpv': {
          target: 'https://betablackbox.aidrone.in/',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/fpv/, '')
        },
        '/ardu': {
          target: 'https://parameter-viewer-forensics-test-network.aidrone.in/',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/ardu/, '')
        }
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
