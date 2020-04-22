import express from 'express';
import dotenv from 'dotenv';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

dotenv.config()
const app = express();

// Webpack dev and hot reload configuration
const webpack_config = require('../webpack.config.js');
const compiler = webpack(webpack_config)
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpack_config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))


app.get("/hello", (req, res) => {
  res.send('Hello world!');
});


const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
