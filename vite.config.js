import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nafankap_test1/',   // ← SLASH AU DÉBUT ET A LA FIN
})
