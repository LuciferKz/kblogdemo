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
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },

  mode: 'development',

  plugins: [
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
      title: 'KModal',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': process.env.NODE_ENV
    })
  ],

  devServer: {
    index: 'index.html',
    contentBase: resolve("dist"),
    port: 9000,
    open: true,
    inline: true,
    hot: false,
    compress: true
  }
}