var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// var nodeModulesPath = path.resolve(__dirname, 'node_modules')
// console.log(process.env.NODE_ENV)

module.exports = {
    entry: path.resolve(__dirname, 'app/index.jsx'),//用于将相对路径转为绝对路径。
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },

    resolve:{
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
                loader: 'style!css!postcss'
            },
            {
                test: /\.less$/,
                loader: 'style!css!postcss!less'
            },
            {
                test:/\.(png|gif|jpg|jpeg|bmp)$/i,
                loader:'url-loader?limit=5000'
            },
            {
                test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i,
                loader:'url-loader?limit=5000'//限制大小5k
            }
        ]
    },

    postcss: [
        require('autoprefixer')({
        	browsers: ['last 5 versions']
        })//调用autoprefixer插件，例如 display: flex
    ],

    plugins: [
        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tmpl.html',//本地模板文件的位置
            /*  title: 'React仿大众点评app',//生成的html文档的标题
             filename:  __dirname + '/app/index.tmpl.html',//输出文件的文件名称
             hash: true,//是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值
             cache: true,//如果为true表示在对应的thunk文件修改后就会emit文件
             showErrors: true,//是否将错误信息输出到html页面中。这个很有用，在生成html文件的过程中有错误信息，输出到页面就能看到错误相关信息便于调试。
             inject: true//向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同。 */
        }),

        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),

        // 打开浏览器
        new OpenBrowserPlugin({
          url: 'http://localhost:8080'
        }),

        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ],

    devServer: {
        proxy: {
            // 凡是 `/api` 开头的 http 请求，都会被代理到 localhost:3000 上
            '/api': {
                target: 'http://localhost:3000',
                secure: false
            }
        },
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        colors: true, //终端中输出结果为彩色
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        hot: true,  // 使用热加载插件 HotModuleReplacementPlugin
        //port: 8080, //端口
    }
}
