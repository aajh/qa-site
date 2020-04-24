import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import * as api from './api-types';

const router = express.Router();

interface Question {
    id: string
    author: string,
    title: string,
    body: string,
    created: Date
}

const questions: Question[] = require('../test_data/questions.json').map((q: any) => ({ ...q, created: new Date(q.created) }));

router.get('/questions', (req, res) => {
    const jsonResponse: api.QuestionSummary[] = questions.map(
        ({ id, author, title, created }) => ({
            id,
            author,
            title,
            created: created.toISOString()
        })
    );
    res.json(jsonResponse);
});

router.get('/questions/:id', (req, res) => {
    const question = questions.find(q => q.id === req.params.id);
    if (question === undefined) {
        res.status(404).end();
    } else {
        const jsonResponse: api.Question = {
            ...question,
            created: question.created.toISOString()
        };
        res.json(jsonResponse);
    }
});

router.post('/questions', (req, res) => {
    if (req.body === undefined) {
        res.status(400).end();
        return;
    }

    const { author, title, body } = req.body;
    if (!author || !title || !body) {
        res.status(400).end();
        return;
    }

    const question: Question = {
        id: uuidv4(),
        author,
        title,
        body,
        created: new Date()
    };
    questions.push(question);

    const jsonResponse: api.Question = {
        ...question,
        created: question.created.toISOString()
    };
    res.json(jsonResponse);
});

export default router;
