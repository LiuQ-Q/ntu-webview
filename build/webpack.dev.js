const webpackBase = require('./webpack.base');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const axios = require('axios');
const Koa = require('koa');
const Router = require('koa-router');

const NTU_BACKEND = 'http://39.100.239.154:8000';

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
			'/mock': {
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
	const { token, language, format } = ctx.request.query;
	const { scanId, filename, reportType } = ctx.params;

	const response = await axios.get(`${NTU_BACKEND}/v1/scans/${scanId}/${reportType}/export/`, {
		headers: {
			Authorization: `Token ${token}`
		},
		params: {
			language: language,
			report_format: format,
		},
	});

	if (format === 'pdf') {
		ctx.body = Buffer.from(response.data.replace(/\n/g, ''), 'base64');
	} else {
		const dataB64 = new Buffer(response.data.replace(/\n/g, ''), 'base64');
		const data = dataB64.toString();
		ctx.body = Buffer.from(data, 'base64');
	}

	
	if (format === 'json' || format === 'pdf') {
		ctx.type = `application/${format}`;
	}

	if (format === 'csv' || format === 'xml') {
		ctx.type = `text/${format}`;
	}
	
	ctx.set('Content-disposition', `attachment; filename=${filename}`);
}).get('/restart', async ctx => {
	ctx.body = '我重启啦!';
}).routes()).listen(4000);
