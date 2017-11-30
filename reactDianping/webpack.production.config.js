var pkg = require('./package.json')
var path = require('path')
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'app/index.jsx'),
    // 将 第三方依赖 单独打包
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].[chunkhash:8].js"
  },

  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.json', '.jsx'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    /* alias: {
        Utils: '../../utils/',
        Components: '../../components'
    } */
},

  module: {
    loaders: [
      {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel'
      },
      {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
      },
      {
          test:/\.(png|gif|jpg|jpeg|bmp)$/i,
          loader:'url-loader?limit=5000&name=img/[name].[hash:8].[ext]'
      },
      {
          test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i,
          loader:'url-loader?limit=5000&name=fonts/[name].[hash:8].[ext]'//限制大小5k
      }
    ]
  },
  postcss: [
    require('autoprefixer')({
      browsers: ['last 5 versions']
    })//调用autoprefixer插件，例如 display: flex
  ],

  plugins: [
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by taoyidehao@github.com."),

    // html 模板插件
    new HtmlWebpackPlugin({
        template: __dirname + '/app/index.tmpl.html'
    }),

    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin(),
    
    new webpack.optimize.UglifyJsPlugin({
        compress: {
          //supresses warnings, usually from module minification
          warnings: false
        }
    }),
    
    // 分离CSS和JS文件
    new ExtractTextPlugin('[name].[chunkhash:8].css'), 
    
    // 提供公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[chunkhash:8].js'
    }),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    })
  ]
}