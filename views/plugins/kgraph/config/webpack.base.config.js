const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

const resolve = function (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = merge(baseConfig, {
  entry: {
    kgraph: resolve('src/main.js'),
    app: resolve('src/app.js'),
    index: resolve('src/kg/index.js')
  },
  output: {
    path: resolve('dist'),
    filename: 'static/js/[name].js'
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        babelrc: false,
        plugins: [
            "dynamic-import-webpack"
        ]
      }
    }, {
      test: /\.css$/,
      // loader: 'style-loader!css-loader',
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    }, {
      test: /\.(eot|svg|ttf|woff)$/,
      loader: 'url-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'kgraph 流程图绘制工具',
      inject: 'body',
      template: resolve('src/index.html')
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].css',
    }),
    new VueLoaderPlugin()
  ]
})