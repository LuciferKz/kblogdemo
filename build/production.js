process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const kgraphConfig = require('../config/webpack.kgraph.js');
const path = require('path');
const rm = require('rimraf');
const chalk = require('chalk');
const warning = chalk.keyword('orange');

// 使用 rm 绝对地址
rm(path.resolve(__dirname, '../plugins/kgraph/dist'), function (err) {
  if (err) throw err;
  webpack(kgraphConfig).run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  
    const info = stats.toJson();
  
    if (stats.hasErrors()) {
      console.error(info.errors);
    }
  
    if (stats.hasWarnings()) {
      // console.warn(info.warnings);
      info.warnings.forEach(text => {
        console.log(warning(text));
      })
    }
  });
});
