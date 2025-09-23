export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      // This will proxy both /api and /auth
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
    sourcemap: false,
    minify: 'terser'
  }
})
