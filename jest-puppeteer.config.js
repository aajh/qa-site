const { PORT } = require('./dist/test/testHelpers');

module.exports = {
    launch: {
        headless: process.env.HEADLESS !== 'false',
    },
    server: {
        command: `PORT=${PORT} NODE_ENV=test node -r source-map-support/register dist/src/server.js`,
        port: PORT,
    },
};
