import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// VITE_BASE is set by the GitHub Pages workflow: "/" when the site is served
// from a custom domain, "/<repo>/" when it is served from username.github.io.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, strictPort: false },
})
