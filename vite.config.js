import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  provider: 'v8',
  reporter: ['lcov', 'text'],
})