const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
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
  }
}