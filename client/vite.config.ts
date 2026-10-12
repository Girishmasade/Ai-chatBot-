import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('/react/') ||
                id.includes('react-redux') ||
                id.includes('@reduxjs/toolkit') ||
                id.includes('redux-thunk') ||
                id.includes('use-sync-external-store')
              ) {
                return 'vendor-core';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              if (id.includes('emoji-picker-react')) {
                return 'vendor-emoji';
              }
              if (id.includes('socket.io-client') || id.includes('engine.io-client')) {
                return 'vendor-socket';
              }
              if (
                id.includes('react-markdown') ||
                id.includes('remark-gfm') ||
                id.includes('micromark') ||
                id.includes('mdast-') ||
                id.includes('unist-')
              ) {
                return 'vendor-markdown';
              }
            }
          },
        },
      },
    },
  };
});
