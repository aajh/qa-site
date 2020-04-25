import express from 'express';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

import * as api from './types';

const router = express.Router();

const connectionVariables: Record<string, string> = {
    development: 'DEV_DATABASE_URL',
    production: 'DATABASE_URL'
};
const pool = new pg.Pool({
    connectionString: process.env[connectionVariables[process.env.NODE_ENV]]
});

router.get('/', async (req, res) => {
    try {
        const { rows: jsonResponse } = await pool.query<api.QuestionSummary>(
            'SELECT id, author, title, created FROM questions'
        );
        res.json(jsonResponse);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const questionResult = await client.query('SELECT * FROM questions WHERE id = $1', [req.params.id]);
        if (questionResult.rowCount === 0) {
            res.status(404).end();
        } else {
            const questionAnswers = await client.query(
                'SELECT id, author, body, created FROM answers WHERE questionId = $1',
                [req.params.id]
            );
            const jsonResponse: api.Question = {
                ...questionResult.rows[0],
                answers: questionAnswers.rows
            };
            res.json(jsonResponse);
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        client.release();
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body === undefined) {
            res.status(400).end();
            return;
        }

        const { author, title, body } = req.body;
        const isInvalid = !author || !title || !body
            || typeof author !== 'string' || author.length >= 128
            || typeof title !== 'string' || author.length >= 512
            || typeof body !== 'string';
        if (isInvalid) {
            res.status(400).end();
            return;
        }

        const { rows } = await pool.query(
            'INSERT INTO questions(id, author, title, body, created) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [uuidv4(), author, title, body]
        );

        const jsonResponse: api.Question = {
            ...rows[0],
            answers: []
        };
        res.json(jsonResponse);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post('/:id/answers', async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: [{ count }] } = await client.query(
            'SELECT COUNT(*) FROM questions WHERE id = $1',
            [req.params.id]
        );
        if (count === 0) {
            res.status(404).end();
            return;
        }

        if (req.body === undefined) {
            res.status(400).end();
            return;
        }

        const { author, body } = req.body;
        const isInvalid = !author || !body
            || typeof author !== 'string' || author.length >= 128
            || typeof body !== 'string';
        if (isInvalid) {
            res.status(400).end();
            return;
        }

        const { rows: [answer] } = await pool.query(
            'INSERT INTO answers(id, questionId, author, body, created) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [uuidv4(), req.params.id, author, body]
        );

        // eslint-disable-next-line no-shadow
        const jsonResponse: api.Answer = (({ id, author, body, created }) => ({
            id, author, body, created
        }))(answer);
        res.json(jsonResponse);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        client.release();
    }
});

export default router;
