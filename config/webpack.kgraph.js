const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const path = require('path');

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../plugins/kgraph/src/app.js'),
  output: {
    path: path.resolve(__dirname, '../plugins/kgraph/static/js'),
    filename: 'kgraph.js'
  },
})