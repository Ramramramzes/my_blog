import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config();

if (!process.env.VITE_PROXY_AUTH || !process.env.VITE_PROXY_POSTS) {
  throw new Error("Не удалось найти необходимые переменные окружения VITE_PROXY_AUTH или VITE_PROXY_WS");
}

const proxyAuth = process.env.VITE_PROXY_AUTH;
const proxyPosts = process.env.VITE_PROXY_POSTS;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/add-user': proxyAuth,
      '/login-user': proxyAuth,
      '/logout': proxyAuth,
      '/refresh-token': proxyAuth,
      '/get-user': proxyAuth,
      '/get-all-posts': proxyPosts,
      '/get-user-posts': proxyPosts,
      '/add-post': proxyPosts,
      '/edit-post': proxyPosts,
      '/delete-post': proxyPosts,
    }
  }
})