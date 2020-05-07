import express from 'express';
import serialize from 'serialize-javascript';
import _ from 'lodash';

import { initialState } from '../slices';
import { pool } from './common';


export default async function renderPage(req: express.Request): Promise<string> {
    const state = _.cloneDeep(initialState);

    if (req.session?.userId) {
        const { userId } = req.session;
        const { rows: [{ username }] } = await pool.query(
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
        <div id="react-container"></div>
        <script>
            window.__PRELOADED_STATE__ = ${serialize(state)}
        </script>
        <script src="/bundle.js"></script>
    </body>
</html>
    `;
}
