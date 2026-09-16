import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server proxies /api to the ASP.NET Core backend so the browser
// never has to deal with cross-origin requests (and the backend's
// Program.cs stays untouched -- no CORS middleware needed).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5194',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
