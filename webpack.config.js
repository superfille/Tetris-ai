const path = require('path');
const phaserModulePath = path.join(__dirname, '/node_modules/phaser/');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js/, loader: 'expose-loader?p2' },
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 8081,
    host: 'localhost'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'My Tetris'
    })
  ],
  resolve: {
    alias: {
        'phaser': path.join(phaserModulePath, 'build/custom/phaser-split.js'),
        'pixi': path.join(phaserModulePath, 'build/custom/pixi.js'),
        'p2': path.join(phaserModulePath, 'build/custom/p2.js'),
    },
    extensions: [ '.ts', '.js' ]
  }
};