import express from 'express';
import Router from 'express-promise-router';
import serialize from 'serialize-javascript';
import _ from 'lodash';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import pg from 'pg';

import { initialState, RootState } from '../slices';
import createStore from '../store';
import App from '../components/App';
import { pool, getUserId } from './common';
import { getQuestionList, getQuestion } from './questions';

async function getInitialState(req: express.Request, client: pg.ClientBase): Promise<RootState> {
    const state = _.cloneDeep(initialState);

    if (req.session?.userId) {
        const { userId } = req.session;
        const { rows: [{ username }] } = await client.query(
            'SELECT username FROM users WHERE id = $1',
            [userId]
        );
        if (username) {
            state.user.user = {
                id: userId,
                username,
            };
        }
    }

    return state;
}

async function renderPage(req: express.Request, state: RootState): Promise<string> {
    const store = createStore(state);

    const reactHtml = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url}>
                <App />
            </StaticRouter>
        </Provider>
    );

    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>QA</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/main.css" rel="stylesheet">
    </head>
    <body>
        <div id="react-container">${reactHtml}</div>
        <script>
            window.__PRELOADED_STATE__ = ${serialize(state)}
        </script>
        <script src="/bundle.js"></script>
    </body>
</html>
    `;
}

const router = Router();

async function getBasePage(req: express.Request, res: express.Response): Promise<void> {
    const client = await pool.connect();
    try {
        const state = await getInitialState(req, client);
        const page = await renderPage(req, state);
        res.send(page);
    } finally {
        client.release();
    }
}

router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const state = await getInitialState(req, client);

        state.questionList.questionList = await getQuestionList(client);
        state.questionList.loading = false;

        const page = await renderPage(req, state);
        res.send(page);
    } finally {
        client.release();
    }
});

router.get('/questions/ask', getBasePage);

router.get('/questions/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const state = await getInitialState(req, client);

        const userId = getUserId(req, res, false);
        const question = await getQuestion(client, req.params.id, userId);

        if (question === null) {
            res.redirect('/404');
            return;
        }

        state.question.question = question;
        state.question.loading = false;
        state.question.showExistingQuestion = true;

        const page = await renderPage(req, state);
        res.send(page);
    } finally {
        client.release();
    }
});

router.get('/*', getBasePage);

export default router;
