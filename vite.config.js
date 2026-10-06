import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pokedex-mini/', // ganti dengan nama repo GitHub kamu sendiri
  plugins: [react()],
})
