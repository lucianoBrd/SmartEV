const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const GoogleFontsPlugin = require('google-fonts-plugin')

let config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "./bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                                                          fallback: 'style-loader',
                                                          use: ['css-loader', 'sass-loader', 'postcss-loader'],
                                                      })
            }]
    },
    plugins: [
        new ExtractTextWebpackPlugin("styles.css"),
        new GoogleFontsPlugin('fonts-config.json')
    ]
};
module.exports = config;
