import Router from 'express-promise-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { pool } from './common';
import { JWTPayload } from './types';

const router = Router();

router.post('/users', async (req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ error: 'invalid request' });
        return;
    }

    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string' || username.length > 128) {
        res.status(400).json({ error: 'invalid request' });
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
});

router.post('/login', async (req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ error: 'invalid request' });
        return;
    }

    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
        res.status(400).json({ error: 'invalid request' });
        return;
    }

    const { rows } = await pool.query(
        'SELECT id, passwordHash FROM users WHERE username = $1',
        [username]
    );

    if (rows.length === 0) {
        res.status(401).json({ error: 'invalid username or password' });
        return;
    }

    const { id, passwordhash: passwordHash } = rows[0];
    const passwordCorrect = await bcrypt.compare(password, passwordHash);
    if (!passwordCorrect) {
        res.status(401).json({ error: 'invalid username or password' });
        return;
    }

    const userForToken: JWTPayload = {
        id,
        username,
        iat: 0,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET);
    res.json({ token });
});

export default router;
