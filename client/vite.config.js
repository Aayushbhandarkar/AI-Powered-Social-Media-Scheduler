import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Remove allowedHosts and proxy for production
    ...(process.env.NODE_ENV === 'development' && {
      allowedHosts: ['0db0c50f031d.ngrok-free.app'],
      proxy: {
        '/api': 'https://ai-powered-social-media-scheduler-backend.onrender.com',
        '/auth': 'https://ai-powered-social-media-scheduler-backend.onrender.com'
      }
    })
  },
  // Add build configuration
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
