const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'client', 'assets');
// const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config = {
	entry: [
			'webpack/hot/dev-server',
			'webpack-hot-middleware/client?http://localhost:8080/',
			path.join(__dirname, '/client/Route.jsx')
	],
	output: {
		path: buildPath,
		filename: 'bundle.js',
		publicPath: '/assets/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	node: {
		child_process: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
  },
  devtool: 'cheap-module-eval-source-map',
	module: {
		noParse: [
			/node_modules\/jspdf\/dist\/jspdf.debug.js/
		],
		loaders: [
			{
				test: /\.jsx$/,
				loaders: ['react-hot', 'babel-loader'],
				exclude: [/node_modules/]
			},
			{
				test: /\.css$/,
				loader: 'style!css?modules',
				include: /flexboxgrid/
			}
		]
	}
};

module.exports = config;
