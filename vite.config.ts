import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/App-Configurator-v2-design/',
  server: {
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: process.env.VITE_API_URL || 'https://integrationtest-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
