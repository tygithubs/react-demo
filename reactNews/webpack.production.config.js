var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/js/root.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['react-html-attrs'], //添加组件的插件配置
        }
      },
      //下面是使用 ant-design 的配置文件
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
      	test: /\.less$/,
      	loader: "style!css!less"
      }
    ]
  },
  output: {
    path: __dirname + "/build",
    filename: "./src/bundle.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    // html 模板插件
    new HtmlWebpackPlugin({
        template: __dirname + '/index.html'
    })
  ],
};
