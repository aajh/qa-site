const { createDb, migrate } = require('postgres-migrations');
require('dotenv').config();

const dbConfig = {
    database: process.env.DB_DATABASE,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT)
};

// eslint-disable-next-line no-console
const config = { logger: console.log };

async function runMigrations() {
    await createDb(dbConfig.database, dbConfig, config);
    await migrate(dbConfig, './migrations', config);
}
runMigrations();
