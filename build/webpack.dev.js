const webpackBase = require('./webpack.base');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const axios = require('axios');
const Koa = require('koa');
const Router = require('koa-router');

const NTU_BACKEND = 'http://52.82.100.75:8000';

module.exports = merge(webpackBase, {
  mode: 'development',
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 3000,
    proxy: {
      '/v1': {
        target: NTU_BACKEND,
        // target: 'https://api-staging.scantist.io',
        // changeOrigin:true,
        // pathRewrite:{
        //     '^/api':''
        // }
      },
      '/mock/report': {
        target: 'http://127.0.0.1:4000'
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
});

new Koa().use(new Router({
  prefix: '/mock'
}).get('/report/:scanId/:filename/:reportType', async ctx => {
  const { token } = ctx.request.query;
  const { scanId, filename, reportType } = ctx.params;

  const response = await axios.get(`${NTU_BACKEND}/v1/scans/${scanId}/${reportType}/export/`, {
    headers: {
      Authorization: `Token ${token}`
    },
    params: {
      language: 'chinese',
      report_format: 'pdf',
    },
  });

  ctx.body = Buffer.from(response.data.replace(/\n/g, ''), 'base64');
  ctx.type = 'application/pdf';
  ctx.set('Content-disposition', `attachment; filename=${filename}`);
}).routes()).listen(4000);
