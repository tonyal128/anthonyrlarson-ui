import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    env: {
      VITE_EXPERIENCE_API_URL: '',
      VITE_EDUCATION_API_URL: '',
      VITE_CERTIFICATIONS_API_URL: '',
    }
  },
})
