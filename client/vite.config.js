import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allow external access
    allowedHosts: ['0db0c50f031d.ngrok-free.app'], // add your ngrok URL here
    proxy: {
      '/api': 'https://ai-powered-social-media-scheduler-backend.onrender.com',
      '/auth': 'https://ai-powered-social-media-scheduler-backend.onrender.com'
    }
  }
})
