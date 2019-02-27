const ClearnWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const path = require('path');

const resolve = function (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js$/i,
        uglifyOptions: {
          comments: false,
          keep_fnames: false,
        }
      })
    ]
  },
  plugins: [
    new ClearnWebpackPlugin(['dist'], { root: resolve('') })
  ]
})