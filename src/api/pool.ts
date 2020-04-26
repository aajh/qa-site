import pg from 'pg';

const connectionVariables: Record<string, string> = {
    development: 'DEV_DATABASE_URL',
    test: 'TEST_DATABASE_URL',
    production: 'DATABASE_URL'
};

const pool = new pg.Pool({
    connectionString: process.env[connectionVariables[process.env.NODE_ENV]]
});

export default pool;
