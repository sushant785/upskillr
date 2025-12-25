import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5174,      // Force port 5174
    strictPort: true, // If 5173 is busy, Vite will fail instead of switching to 5174
  }
  
})
