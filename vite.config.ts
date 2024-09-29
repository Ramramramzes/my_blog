import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyAuth = 'http://localhost:3000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/addUser': proxyAuth,
      '/login': proxyAuth
    }
  }
})
