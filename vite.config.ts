import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:4000',
        //target: 'https://qulearn-backend-c497212f0dc2.herokuapp.com',
        changeOrigin: true,
      },
    },
    allowedHosts: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
