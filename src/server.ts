/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import dotenv from 'dotenv';
import connectHistoryApiFallback from 'connect-history-api-fallback';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import api from './api';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', api);

app.use(connectHistoryApiFallback());

// Webpack dev and hot reload configuration
const webpackConfig = require('../webpack.config.js');

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server started at http://localhost:${port}`);
});
