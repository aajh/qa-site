import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';

import { JWTPayload } from './types';

const connectionVariables: Record<string, string> = {
    development: 'DEV_DATABASE_URL',
    test: 'TEST_DATABASE_URL',
    production: 'DATABASE_URL'
};

export const pool = new pg.Pool({
    connectionString: process.env[connectionVariables[process.env.NODE_ENV ?? 'development']]
});

export function getDecodedToken(
    req: express.Request,
    res: express.Response,
    sendErrorOnInvalid = true
): JWTPayload | null {
    const authorization = req.get('authorization');
    const token = authorization && authorization.toLowerCase().startsWith('bearer ')
        ? authorization.substring(7)
        : null;

    let decodedToken: JWTPayload | null = null;
    try {
        if (token) {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.info(error);
    }

    if (token === null || decodedToken === null || !decodedToken.id) {
        if (sendErrorOnInvalid) {
            res.status(401).json({ error: 'token missing or invalid' });
        }
        return null;
    }

    return decodedToken;
}
