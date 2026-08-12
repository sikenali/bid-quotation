import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor';
          if (id.includes('node_modules/react-router-dom/')) return 'router';
          if (id.includes('node_modules/zustand/')) return 'state';
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});