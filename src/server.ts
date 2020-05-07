/* eslint-disable import/first */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import dotenv from 'dotenv';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';


dotenv.config();

import api from './api';
import { pool } from './api/common';

const app = express();

app.use(express.json());
app.use(session({
    store: new (connectPgSimple(session))({
        pool
    }),
    secret: process.env.COOKIE_SESSION_SECRET ?? '',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use('/api', api);
app.use(express.static('dist/static'));
app.use(connectHistoryApiFallback());

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('../../webpack.dev.config.js');

    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: process.env.NODE_ENV === 'test' ? 'errors-only' : undefined,
    }));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.set('trust proxy', 1);
}

app.use((err: any, req: any, res: any, next: any) => {
    // eslint-disable-next-line no-console
    console.error(err);
    if (res.headersSent) {
        next(err);
        return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server started at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});
