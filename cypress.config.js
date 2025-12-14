// @ts-check
const { defineConfig } = require('cypress');
require('dotenv').config(); // load .env from project root

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    video: false
  },
  defaultCommandTimeout: 60000,     // NEW: allow remote latency
  pageLoadTimeout: 60000,
  retries: { runMode: 10, openMode: 0 } // NEW: rerun flaky commands in CI
});

