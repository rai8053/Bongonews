
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Fix: Use type assertion for process to resolve "Property 'cwd' does not exist on type 'Process'" error.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    },
    build: {
      target: 'esnext'
    }
  };
});
