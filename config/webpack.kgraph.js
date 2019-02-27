const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const resolve = function (dir) {
  return path.resolve(__dirname, '../views/plugins/', dir)
}

module.exports = merge(baseConfig, {
  mode: process.env.NODE_ENV,
  entry: {
    kgraph: resolve('kgraph/src/main.js'),
    app: resolve('kgraph/src/app.js')
  },
  output: {
    path: resolve('kgraph/dist'),
    filename: 'static/js/[name].js'
  },
  devServer: {
    contentBase: resolve('kgraph')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'kgraph 流程图绘制工具',
      inject: 'body',
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].css',
    })
  ]
})