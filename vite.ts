import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Space/', // <-- ¡AÑADE ESTA LÍNEA EXACTAMENTE ASÍ!
})
