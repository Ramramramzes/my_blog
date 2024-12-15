import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config();

if (!process.env.VITE_PROXY_AUTH || !process.env.VITE_PROXY_WS) {
  throw new Error("Не удалось найти необходимые переменные окружения VITE_PROXY_AUTH или VITE_PROXY_WS");
}

const proxyAuth = process.env.VITE_PROXY_AUTH;
const proxyWs = process.env.VITE_PROXY_WS;


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/addUser': proxyAuth,
      '/login-user': proxyAuth,
      '/logout': proxyAuth,
      '/refresh-token': proxyAuth,
      '/ws': {
        target: proxyWs,
        changeOrigin: true,
        ws: true,
      },
    }
  }
})