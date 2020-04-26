module.exports = {
    preset: 'jest-puppeteer',
    globalSetup: './global-setup.js',
    globalTeardown: './global-teardown.js',
    rootDir: 'test',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
