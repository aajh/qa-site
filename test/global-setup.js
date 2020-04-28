const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

const { runMigrations, resetDatabase } = require('./testHelpers');

module.exports = async function globalSetup(globalConfig) {
    await setupPuppeteer(globalConfig);
    await runMigrations();
    await resetDatabase();
};
