import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Remove proxy entirely to avoid confusion
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Add base URL for production if needed
  base: process.env.NODE_ENV === 'production' ? '/' : '/'
})
