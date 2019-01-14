const path = require('path')
const { VueLoaderPlugin } = require('vue-loader');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: resolve('src/main.js'),

  output: {
    filename: '[name].[chunkhash].js',
    path: resolve('dist'),
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.js',
    }
  },
  module: {
    rules: [
      {
        loader: 'vue-loader',
        test: /\.vue$/
      },
      {
        loader: 'style-loader!css-loader!less-loader',
        test: /\.less$/
      },
      {
        loader: 'style-loader!css-loader',
        test: /\.css$/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets=es2015',
        exclude: /node_modules/
      }
    ]
  },

  mode: 'development',

  plugins: [
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': process.env.NODE_ENV
    })
  ],

  devServer: {
    index: 'index.html',
    contentBase: path.join(__dirname, "./dist/"),
    port: 9000,
    open: true,
    inline: true,
    hot: false,
    compress: true
  }
}