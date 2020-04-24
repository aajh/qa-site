/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import dotenv from 'dotenv';
import connectHistoryApiFallback from 'connect-history-api-fallback';

import api from './api';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', api);

app.use(connectHistoryApiFallback());

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('../webpack.dev.config.js');

    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('dist/static'));

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server started at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});
