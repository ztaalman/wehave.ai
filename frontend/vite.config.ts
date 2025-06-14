import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.onrender.com', 'wehave.ai']
  },
  build: {
    chunkSizeWarningLimit: 1600
  }
})
