const webpackBase = require('./webpack.base');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(webpackBase, {
  mode: 'development',
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://52.82.100.75:8000',
        target: 'https://api-staging.scantist.io/v1',
        // bypass(req, res, proxyOptions) {
        //   console.log(req, res, proxyOptions)
        // }
      }
		},
    host: '0.0.0.0',
    hot: true,
    inline: true,
    disableHostCheck: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './index.html')
    })
  ]
})