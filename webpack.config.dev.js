/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
var webpack = require('webpack');
module.exports = {
    entry: {
        quiz: 'quiz.js',
        quizApp: 'quizApp.js',
        cqApp: 'createQuizApp/CQApp.js',
        vendor: ['fastclick', 'react', 'superagent', 'object-assign']
    },
    plugins: [ new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js') ],
    cache: true,
    output: {
        path: __dirname,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },

            {
                test: /\.es6.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer-loader?browsers=last 2 version!sass'
            },
            {
                test: /\.css$/,
                loader: 'style!css!autoprefixer-loader?browsers=last 2 version'
            }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.scss'],
        modulesDirectories: ['node_modules', 'scripts']
    },
    devtool: '#source-map'
};
