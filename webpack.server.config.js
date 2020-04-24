const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => ({
    mode: argv.mode,
    target: 'node',
    devtool: 'source-map',
    externals: [nodeExternals()],

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    entry: './src/server.ts',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
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
    }
});
