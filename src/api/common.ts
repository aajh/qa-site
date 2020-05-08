import express from 'express';
import pg from 'pg';

const connectionVariables: Record<string, string> = {
    development: 'DEV_DATABASE_URL',
    test: 'TEST_DATABASE_URL',
    production: 'DATABASE_URL'
};

export const pool = new pg.Pool({
    connectionString: process.env[connectionVariables[process.env.NODE_ENV ?? 'development']]
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
