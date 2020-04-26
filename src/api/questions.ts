import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import * as api from './types';
import pool from './pool';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows: jsonResponse } = await pool.query<api.QuestionSummary>(
            `SELECT questions.id, username as author, title, created
            FROM questions
            INNER JOIN users ON users.id=questions.authorId`
        );
        res.json(jsonResponse);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

router.get('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const questionResult = await client.query(
            `SELECT questions.id, username as author, title, body, created
            FROM questions
            INNER JOIN users ON users.id=questions.authorId
            WHERE questions.id = $1`,
            [req.params.id]
        );
        if (questionResult.rowCount === 0) {
            res.status(404).end();
        } else {
            const { rows: questionAnswers } = await client.query(
                `SELECT answers.id, users.username as author, body, created
                FROM answers
                INNER JOIN users on users.id=answers.authorId
                WHERE questionId = $1`,
                [req.params.id]
            );
            const jsonResponse: api.Question = {
                ...questionResult.rows[0],
                answers: questionAnswers
            };
            res.json(jsonResponse);
        }
    } catch (error) {
        console.error(error);
        res.status(500).end();
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
            || typeof author !== 'string' || author.length > 128
            || typeof title !== 'string' || author.length > 512
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
        console.error(error);
        res.status(500).end();
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
            || typeof author !== 'string' || author.length > 128
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
        console.error(error);
        res.status(500).end();
    } finally {
        client.release();
    }
});

export default router;
