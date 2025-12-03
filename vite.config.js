import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://oswal.omsoftsolution.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/doctor/doctor/api'),
        secure: false,
      }
    }
  },
  // Add this for production build
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})