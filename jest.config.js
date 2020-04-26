module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './test/global.setup.js',
    globalTeardown: './test/global.teardown.js',
};
