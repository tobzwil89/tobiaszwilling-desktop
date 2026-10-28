import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Eigene Domain → base ist "/"
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
