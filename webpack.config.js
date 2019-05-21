const path = require('path');
const phaserModulePath = path.join(__dirname, '/node_modules/phaser/');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 8081,
    host: 'localhost'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My Tetris'
    })
  ],
  resolve: {
    extensions: [ '.ts', '.js' ]
  }
};