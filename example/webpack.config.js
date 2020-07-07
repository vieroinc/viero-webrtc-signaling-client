"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: 'development',
  entry: {
    "index": path.resolve(__dirname, "index.js"),
  },
  output: {
    path: path.resolve(__dirname, ""),
    filename: "[name].bundle.js",
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devtool: "source-map",
  devServer: {
    disableHostCheck: true,
    inline: true,
    host: '0.0.0.0',
    port: 8080,
  },
  stats: {
    colors: true,
  },
};
