const webpackBase = require('./webpack.base');
const merge = require('webpack-merge');
const path = require('path');

module.exports = merge(webpackBase, {
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
});