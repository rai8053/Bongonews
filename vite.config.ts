
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react({
      jsxRuntime: 'automatic'
    })],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    },
    resolve: {
      alias: {
        // Force resolution to help with React 18/19 build issues on some CI environments
        'react/jsx-runtime': 'react/jsx-runtime.js'
      }
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  };
});
