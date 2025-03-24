import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  publicDir: 'public',

  server: {
    port: 3000,
    strictPort: true,
    open: true,
  }
});
