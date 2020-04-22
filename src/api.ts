import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import * as api from './api-types';

const router = express.Router();

interface Question {
    id:         string
    questioner: string,
    title:      string,
    body:       string,
    created:    Date
}

const questions: Question[] = require('../test_data/questions.json').map((q: any) => { return {...q, created: new Date(q.created)}});

router.get('/questions', (req, res) => {
    const json_response: api.QuestionSummary[] = questions.map(({ id, questioner, title, created }) => { return {
        id, questioner, title,
        created: created.toString()
    }});
    res.json(json_response);
})

router.get('/questions/:id', (req, res) => {
    const question = questions.find(q => q.id === req.params.id);
    if (questions === undefined) {
        res.status(404).end();
    } else {
        const json_response: api.Question = {
            ...question,
            created: question.created.toString()
        };
        res.json(json_response);
    }
})

router.post('/questions', (req, res) => {
    if (req.body === undefined) {
        res.status(400).end();
        return;
    }

    const { questioner, title, body } = req.body;
    if (questioner === undefined || title === undefined || body === undefined) {
        res.status(400).end();
        return;
    }

    const question: Question = {
        id: uuidv4(),
        questioner,
        title,
        body,
        created: new Date()
    }
    questions.push(question);

    const json_response: api.Question = {
        ...question,
        created: question.created.toString()
    };
    res.json(json_response);
});

export default router;