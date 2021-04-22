const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');//帮助打开浏览器
const env = process.env.NODE_ENV;
let isProd = (env == 'prod') ? true : false;
module.exports = {
    devtool: isProd ? '' : 'cheap-module-source-map',
    entry: __dirname + '/src/main.js',
    output: {
        // path: path.resolve(__dirname, 'public/'),
        path: path.resolve(__dirname, '../'),
        // filename: isProd ? 'AirocovMap.min.js' : 'AirocovMap.js'
        filename: 'AirocovMap.js'
    },
    devServer: {
        port: 8080,
        host: '0.0.0.0', //实现局域网内访问
        contentBase: './public',//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015", "stage-0"],
                        plugins: ['transform-runtime']
                    }
                },
            }
        ]
    },
    plugins: [
        //用默认浏览器打开
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        })
    ]
}

//生产环境添加插件
if (isProd) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            comments: false, //去掉注释
            compress: {
                warnings: false //忽略警告,要不然会有一大堆的黄色字体出现
            }
        }),
        //添加banner
        new webpack.BannerPlugin({
            banner: `AirocovMap v1.0 | (c) Copyright Airocov inc. | build: ${getCurrentDate()}`
        })
    );

}

function getCurrentDate() {
    let date = new Date();
    let monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'];
    let weekArray = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let month = date.getMonth();
    let day = date.getDate();
    if (day.toString().length == 1) {
        day = '0' + day.toString();
    }
    return `${monthArray[month]} day ${date.getFullYear()} ${weekArray[date.getDay()]}`;
}