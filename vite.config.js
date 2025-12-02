import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/


export default {
    plugins: [react()],// vite.config.js
  server: {
    proxy: {
      '/api': {
        target: 'https://oswal.omsoftsolution.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/doctor/doctor/api')
      }
    }
  }
}

