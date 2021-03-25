const path = require('path');
	// работа с html 
const HtmlWebpackPlugin = require('html-webpack-plugin');
// отчистка папки build
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;

const isDev = mode === 'development';

const generateFileName = ext => isDev ? 
	`[name].${ext}` :
	`[name].[contenthash].${ext}`;

module.exports = {
	// папка откуда берутся все файлы
	context: path.resolve(__dirname, 'src'),
	mode,
	// точка входа
	entry: './js/index.js',
	//точка выхода
	output: {
		// имя будующего js файла 
		filename: `./js/${generateFileName('js')}`,
		// все файлы будут импортированны в данный каталог
		path: path.resolve(__dirname, 'build'),
		environment: {
			arrowFunction: false
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/i,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					},
				},
				exclude: /node_modules/,
			},
			{
				test: /\.(c|sa|sc)ss$/i,
				use:[
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
						}
					},
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpg|jpeg|svg|gif)$/i,
				use: {
					loader: 'file-loader',
					options : {
						name: '[path][name].[ext]',
					}
				}
			},
			{
				test: /\.html$/i,
				use: ['html-loader']
			}
		]
	},
	plugins: [
		// работа с html 
		new HtmlWebpackPlugin({
			template: './html/index.html',
			minify: {
				collapseWhitespace: !isDev
			}
		}),
		new MiniCssExtractPlugin({
			filename: `./css/${generateFileName('css')}`,
		}),
		// отчистка папки build
		new CleanWebpackPlugin(),
	],
	devtool: isDev && 'source-map'
};

