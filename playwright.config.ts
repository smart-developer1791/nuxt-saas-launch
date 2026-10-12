import { defineConfig, devices } from '@playwright/test'
import { env } from 'node:process'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(env.CI),
  workers: env.CI ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --listen tcp://127.0.0.1:4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !env.CI,
  },
})
