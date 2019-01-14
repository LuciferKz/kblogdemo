const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const path = require('path');

let entry = path.resolve(__dirname, '../plugins/kgraph/main.js'),
output = path.resolve(__dirname, '../views/plugins/kgraph/static/js');

module.exports = merge(baseConfig, {
  mode: process.env.NODE_ENV,
  entry: entry,
  output: {
    path: output,
    filename: 'kgraph.js'
  },
})