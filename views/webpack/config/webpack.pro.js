const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob');

let getEntry = function (globPath) {
  let files = glob.sync(globPath);
  let entries = {};

  for (let i = 0, len = files.length; i < len; i++) {
    let file = files[i];
    let extname = path.extname(file),
    basename = path.basename(file, extname);
    entries[basename] = file;
  }
  return entries;
}

let entries = getEntry('./plugins/*/*.js'), cacheGroups = {};

for (let k in entries) {
  cacheGroups[k] = {
    name: k,
    filename: `./views/plugins/${k}/static/js/${k}.js`
  }
}

entries['navs'] = './plugins/navs.js';
cacheGroups['navs'] = {
  name: 'navs'
}

console.log(entries, cacheGroups);

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../'),
  },
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: cacheGroups
    }
  },
  devServer: {}
})