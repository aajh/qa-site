/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    devtool: 'source-map',

    devServer: {
        contentBase: './dist/static',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    entry: ['./src/index.tsx', 'webpack-hot-middleware/client?reload=true'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist', 'static'),
        publicPath: '/',
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin(),
    ]
};
