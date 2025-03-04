import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para acesso externo
    port: 80,
    strictPort: true // Garante que use exatamente a porta 80
  },
  preview: {
    host: true,
    port: 80,
    strictPort: true
  }
})
