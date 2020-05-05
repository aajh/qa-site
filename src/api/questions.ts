import Router from 'express-promise-router';
import { v4 as uuidv4 } from 'uuid';

import * as api from './types';
import { pool, getDecodedToken } from './common';

const router = Router();

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
function isUuid(uuid: string) {
    return uuidRegex.test(uuid);
}

router.get('/', async (req, res) => {
    const { rows: jsonResponse } = await pool.query<api.QuestionSummary>(
        `SELECT questions.id, username as author, title, created
        FROM questions
        LEFT JOIN users ON users.id=questions.author_id
        ORDER BY created DESC`
    );
    res.json(jsonResponse);
});

router.get('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        if (!isUuid(req.params.id)) {
            res.status(404).json({ error: 'not found' });
            return;
        }
        const questionResult = await client.query(
            `SELECT questions.id, username as author, title, body, created
            FROM questions
            LEFT JOIN users ON users.id=questions.author_id
            WHERE questions.id = $1`,
            [req.params.id]
        );
        if (questionResult.rowCount === 0) {
            res.status(404).json({ error: 'not found' });
            return;
        }

        const token = getDecodedToken(req, res, false);

        const { rows: questionAnswers } = await client.query(
            `SELECT answers.id, users.username as author, body, created, COALESCE(votes, 0) AS votes, answer_votes.direction AS vote_direction
            FROM answers
            LEFT JOIN users ON users.id=answers.author_id
            LEFT JOIN (
                SELECT answer_id, SUM(direction) AS votes
                FROM answer_votes
                GROUP BY answer_id
                ) AS votes ON answers.id=votes.answer_id
            LEFT JOIN answer_votes ON (answer_votes.answer_id=answers.id AND answer_votes.user_id=$2)
            WHERE question_id = $1
            ORDER BY created DESC`,
            [req.params.id, token?.id]
        );
        const jsonResponse: api.Question = {
            ...questionResult.rows[0],
            answers: questionAnswers
                // eslint-disable-next-line @typescript-eslint/camelcase
                .map(({ id, author, body, created, votes, vote_direction }) => ({
                    id,
                    author,
                    body,
                    created,
                    votes: Number(votes),
                    voteDirection: vote_direction,
                }))
        };
        res.json(jsonResponse);
    } finally {
        client.release();
    }
});

router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        if (req.body === undefined) {
            res.status(400).json({ error: 'invalid request' });
            return;
        }

        const { title, body } = req.body;
        const isInvalid = !title || !body
            || typeof title !== 'string' || title.length > 512
            || typeof body !== 'string' || body.length === 0;
        if (isInvalid) {
            res.status(400).json({ error: 'invalid request' });
            return;
        }

        const token = getDecodedToken(req, res);
        if (token === null) {
            return;
        }

        const { rows } = await client.query(
            `INSERT INTO questions(id, author_id, title, body, created)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, title, body, created`,
            [uuidv4(), token.id, title, body]
        );

        const { rows: [{ username }] } = await client.query(
            'SELECT username FROM users WHERE id = $1',
            [token.id]
        );

        const jsonResponse: api.Question = {
            ...rows[0],
            author: username,
            answers: []
        };
        res.json(jsonResponse);
    } finally {
        client.release();
    }
});

router.post('/:id/answers', async (req, res) => {
    const client = await pool.connect();
    try {
        if (!isUuid(req.params.id)) {
            res.status(404).json({ error: 'not found' });
            return;
        }
        const { rows: [{ count }] } = await client.query(
            'SELECT COUNT(*) FROM questions WHERE id = $1',
            [req.params.id]
        );
        if (Number(count) === 0) {
            res.status(404).json({ error: 'not found' });
            return;
        }

        if (req.body === undefined) {
            res.status(400).json({ error: 'invalid request' });
            return;
        }

        const { body } = req.body;
        if (!body || typeof body !== 'string' || body.length === 0) {
            res.status(400).json({ error: 'invalid request' });
            return;
        }

        const token = getDecodedToken(req, res);
        if (token === null) {
            return;
        }

        const { rows: [answer] } = await client.query(
            `INSERT INTO answers(id, question_id, author_id, body, created)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, body, created`,
            [uuidv4(), req.params.id, token.id, body]
        );

        const { rows: [{ username }] } = await client.query(
            'SELECT username FROM users WHERE id = $1',
            [token.id]
        );

        const jsonResponse: api.Answer = {
            ...answer,
            author: username,
            votes: 0,
        };
        res.json(jsonResponse);
    } finally {
        client.release();
    }
});

router.post('/:questionId/answers/:answerId/vote', async (req, res) => {
    const client = await pool.connect();
    try {
        if (!isUuid(req.params.questionId) || !isUuid(req.params.answerId)) {
            res.status(404).json({ error: 'not found' });
            return;
        }
        const { rows: [{ count }] } = await client.query(
            'SELECT COUNT(*) FROM answers WHERE id = $1 AND question_id = $2',
            [req.params.answerId, req.params.questionId]
        );
        if (Number(count) === 0) {
            res.status(404).json({ error: 'not found' });
            return;
        }

        if (req.body === undefined) {
            res.status(400).json({ error: 'invalid request' });
            return;
        }

        const { direction } = req.body;
        if (direction !== 1 && direction !== -1 && direction !== null) {
            res.status(400).json({ error: 'invalid request' });
            return;
        }

        const token = getDecodedToken(req, res);
        if (token === null) {
            return;
        }

        if (direction !== null) {
            client.query(
                `INSERT INTO answer_votes(answer_id, user_id, direction)
                VALUES ($1, $2, $3)
                ON CONFLICT (answer_id, user_id) DO UPDATE SET direction=$3`,
                [req.params.answerId, token.id, direction]
            );
        } else {
            client.query(
                'DELETE FROM answer_votes WHERE answer_id = $1 AND user_id = $2',
                [req.params.answerId, token.id]
            );
        }

        res.status(200).end();
    } finally {
        client.release();
    }
});

export default router;
