const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const path = require('path');

const resolve = function (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: resolve('dist'),
    open: true
  }
})