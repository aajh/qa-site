import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connect_history_api_fallback from 'connect-history-api-fallback';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import api from './api';

dotenv.config()
const app = express();

app.use(express.json())
app.use('/api', api);

app.use(connect_history_api_fallback())

// Webpack dev and hot reload configuration
const webpack_config = require('../webpack.config.js');
const compiler = webpack(webpack_config)
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpack_config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
