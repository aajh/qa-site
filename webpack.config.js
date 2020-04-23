const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    devtool: 'source-map',

    devServer: {
        contentBase: './dist',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    entry: ['./src/index.tsx', 'webpack-hot-middleware/client?reload=true'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
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
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            hash: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
};
