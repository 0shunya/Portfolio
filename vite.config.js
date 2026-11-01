import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served as a GitHub Pages project site at /Portfolio/.
  base: '/Portfolio/',
  plugins: [react()],
})
