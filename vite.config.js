// vite.config.js (CORRECT)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/election': {
                target: 'http://localhost:1000',
                changeOrigin: true,
            }
        }
    }
})