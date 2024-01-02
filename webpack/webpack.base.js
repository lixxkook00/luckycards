const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;

const ENV = require('./webpack.env');

module.exports = {
    entry: { app: path.resolve(ENV.clientPath, 'src', 'index.js') },

    output: { filename: '[name].js', path: path.resolve(ENV.distPath) },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: { output: { comments: false } },
            }),
            new CssMinimizerPlugin(),
        ],
    },

    performance: {
        hints: false,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(gif|png|jpe?g|svg|xml)$/i,
                type: 'asset/resource',
                generator: { filename: 'static/images/[name][ext]' },
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset/resource',
                generator: { filename: 'fonts/[name][ext]' },
            },
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                syntax: 'postcss-scss',
                                plugins: [require('autoprefixer')],
                            },
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true),
            'typeof EXPERIMENTAL': JSON.stringify(false),
            'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
            'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
            'typeof FEATURE_SOUND': JSON.stringify(true),
        }),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new CleanWebpackPlugin(),
        new HTMLInlineCSSWebpackPlugin(),
    ],

    resolve: { alias: { '@': path.resolve(ENV.clientPath, 'src') } },
};
