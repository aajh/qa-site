import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import pool from './pool';
import { JWTPayload } from './types';

const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        if (req.body === undefined) {
            res.status(400).end();
            return;
        }

        const { username, password } = req.body;
        if (typeof username !== 'string' || typeof password !== 'string' || username.length > 128) {
            res.status(400).end();
            return;
        }

        // TODO: Give error if the username exists.

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const id = uuidv4();

        await pool.query(
            'INSERT INTO users(id, username, passwordHash) VALUES ($1, $2, $3)',
            [id, username, passwordHash]
        );

        res.json({ id, username });
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

router.post('/login', async (req, res) => {
    try {
        if (req.body === undefined) {
            res.status(400).end();
            return;
        }

        const { username, password } = req.body;
        if (typeof username !== 'string' || typeof password !== 'string') {
            res.status(400).end();
            return;
        }

        const { rows } = await pool.query(
            'SELECT id, passwordHash FROM users WHERE username = $1',
            [username]
        );

        if (rows.length === 0) {
            res.status(401).json({
                error: 'invalid username or password'
            });
            return;
        }

        const { id, passwordhash: passwordHash } = rows[0];
        const passwordCorrect = await bcrypt.compare(password, passwordHash);
        if (!passwordCorrect) {
            res.status(401).json({
                error: 'invalid username or password'
            });
            return;
        }

        const userForToken: JWTPayload = {
            id,
            username
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET);
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

export default router;
