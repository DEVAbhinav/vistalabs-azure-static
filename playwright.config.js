const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const skipWebServer = process.env.PLAYWRIGHT_NO_SERVER === '1';

const config = {
  testDir: './tests',
  timeout: 45000,
  expect: {
    timeout: 5000
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] }
    }
  ]
};

if (!skipWebServer) {
  config.webServer = {
    command: 'npm run dev',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  };
}

module.exports = defineConfig(config);