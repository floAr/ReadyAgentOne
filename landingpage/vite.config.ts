import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@content': resolve(__dirname, 'src/content'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
