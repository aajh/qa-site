import 'isomorphic-fetch';

import { resetDatabase, SERVER_URL } from '../testHelpers';
import * as api from '../../src/api/types';

beforeEach(async () => {
    await resetDatabase();
});

test('GET /questions', async () => {
    const response = await fetch(`${SERVER_URL}/api/questions`);
    expect(response.ok).toBe(true);
    const questionList = await response.json();
    expect(questionList).toMatchSnapshot();
});

test('GET /questions/:id', async () => {
    const response = await fetch(`${SERVER_URL}/api/questions/9eae28b9-a77b-4f39-901d-140e2d4a710c`);
    expect(response.ok).toBe(true);
    const question = await response.json();
    expect(question).toMatchSnapshot();
});

test('POST /questions', async () => {
    const question = {
        title: 'Test',
        author: 'Test author',
        body: 'Test body',
    };
    const response = await fetch(`${SERVER_URL}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
    });
    expect(response.ok).toBe(true);
    const createdQuestion: api.Question = await response.json();
    expect(createdQuestion.title).toBe(question.title);
    expect(createdQuestion.author).toBe(question.author);
    expect(createdQuestion.body).toBe(question.body);
    expect(createdQuestion.id).toBeDefined();
    expect(createdQuestion.created).toBeDefined();
    expect(createdQuestion.answers).toEqual([]);
});

test('POST /questions/:id/answers', async () => {
    const answer = {
        title: 'Test',
        author: 'Test author',
        body: 'Test body',
    };
    const response = await fetch(`${SERVER_URL}/api/questions/9eae28b9-a77b-4f39-901d-140e2d4a710c/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer)
    });
    expect(response.ok).toBe(true);
    const createdAnswer: api.Answer = await response.json();
    expect(createdAnswer.author).toBe(answer.author);
    expect(createdAnswer.body).toBe(answer.body);
    expect(createdAnswer.id).toBeDefined();
    expect(createdAnswer.created).toBeDefined();
});
