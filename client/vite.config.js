import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Proxy only in development
    proxy: {
      '/api': {
        target: 'https://ai-powered-social-media-scheduler-backend.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'https://ai-powered-social-media-scheduler-backend.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
    // Remove minify: 'terser' - Vite uses esbuild by default which is faster
  }
})
