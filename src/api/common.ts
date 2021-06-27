import express from 'express';
import pg from 'pg';

const connectionVariables: Record<string, string> = {
    development: 'DEV_DATABASE_URL',
    test: 'TEST_DATABASE_URL',
    production: 'DATABASE_URL'
};

const databaseUrl = process.env[connectionVariables[process.env.NODE_ENV ?? 'development']];
const connectionString = databaseUrl + (process.env.NODE_ENV === 'production' ? '?sslmode=require' : '');

export const pool = new pg.Pool({
    connectionString,
    ssl:  process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export function getUserId(
    req: express.Request,
    res: express.Response,
    sendErrorOnInvalid = true
): string | null {
    const { userId } = req.session!;

    if (!userId) {
        if (sendErrorOnInvalid) {
            res.status(401).json({ error: 'not logged in' });
        }
        return null;
    }

    return userId;
}

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export function isUuid(uuid: string) {
    return uuidRegex.test(uuid);
}
