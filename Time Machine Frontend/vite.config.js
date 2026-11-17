import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API origin the dev server proxies to. Overridable so the backend can be
// run on another port without editing this file.
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },

  build: {
    // The entry chunk is what stands between a visitor and the portal, so the
    // large third-party players are split out and cached independently of app
    // code. lottie-web and jspdf are additionally loaded on demand at their
    // call sites, so they never appear in the critical path at all.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          gsap: ['gsap'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
