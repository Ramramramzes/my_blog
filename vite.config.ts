import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

const serverPath = path.resolve(__dirname, 'src/server');
const SERVER = 'http://localhost:3001'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: id => id.startsWith(serverPath)
    }
  },
  server: {
    proxy:{
      '/checkAllUsers': SERVER,
      '/addUser': SERVER,
      '/checkOneUser': SERVER,
      '/getblogpost': SERVER,
      '/checktoken': SERVER,
      '/getuser': SERVER,
      '/postnewpost': SERVER,
      '/upload': SERVER,
      '/delete-image': SERVER,
      '/update-token': SERVER,
      '/get-news': SERVER,
      '/like': SERVER,
      '/dislike': SERVER,
      '/get-likes': SERVER,
      '/update-post-image': SERVER,
    }
  }
})
