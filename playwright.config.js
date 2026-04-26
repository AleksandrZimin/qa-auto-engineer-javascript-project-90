// @ts-check
import { defineConfig, devices } from '@playwright/test'
import { defineCoverageReporterConfig } from '@bgotink/playwright-coverage'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'
import process from 'node:process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    [
      '@bgotink/playwright-coverage',
      defineCoverageReporterConfig({
        sourceRoot: __dirname,
        exclude: ['node_modules/**'],
        resultDir: path.join(__dirname, 'coverage'),
        reports: [
          ['lcovonly', { file: 'lcov.info' }],
          // @ts-ignore
          ['text-summary', { file: null }],
        ],
      }),
    ],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})