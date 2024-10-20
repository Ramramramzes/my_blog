import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config();

const proxyAuth = `http://localhost:3030`;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/addUser': proxyAuth,
      '/login-user': proxyAuth,
      '/logout': proxyAuth,
    }
  }
})