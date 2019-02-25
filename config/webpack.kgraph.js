const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

let entry = path.resolve(__dirname, '../plugins/kgraph/src/app.js'),
output = path.resolve(__dirname, '../plugins/kgraph/dist');

module.exports = merge(baseConfig, {
  mode: process.env.NODE_ENV,
  entry: entry,
  output: {
    path: output,
    filename: 'static/js/[name].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../views/plugins/kgraph')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        modules: {
          test: /[\\/]modules[\\/]/,
          name: "modules",
          chunks: "initial"
        }
      }
    }
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