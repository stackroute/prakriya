const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
// const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config = {
	entry: [
		'webpack/hot/dev-server',
		'webpack/hot/only-dev-server',
		path.join(__dirname, '/client/Route.jsx')
	],
	devServer: {
		contentBase: './',
		hot: true,
		inline: true,
		port: 3000,
		host: 'localhost'
	}, 
	output: {
		path: buildPath,
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
	node: {
      	child_process: 'empty',
      	fs: "empty",
      	net: "empty",
      	tls: "empty"
    },
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				loaders: ['react-hot', 'babel-loader'],
				exclude: [/node_modules/]
			}
		]
	}
}

module.exports = config;