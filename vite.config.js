import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],  // только unit-тесты
    exclude: ['tests/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      include: ['src/**'],
    },
  },
})