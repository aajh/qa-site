const { fork } = require('child_process');

const { runMigrations, PORT } = require('./testHelpers');

module.exports = async () => {
    await runMigrations();
    global.SERVER_PROCESS = fork('dist/src/server.js', [], {
        env: {
            ...process.env,
            PORT,
            NODE_ENV: 'test',
        }
    });
};
