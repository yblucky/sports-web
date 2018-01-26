const helpers = require('./helpers');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'polyfills': './src/app/polyfills.ts', // 运行Angular时所需的一些标准js
    'vendor': './src/app/vendor.ts', // Angular、Lodash、bootstrap.css......
    'app': './src/app/main.ts' // 应用代码
  },
  resolve: { // 解析模块路径时的配置
    extensions: ['.ts', '.js'], // 制定模块的后缀，在引入模块时就会自动补全
    modules: [helpers.root('node_modules'),helpers.root('web_modules')]
  },
  module: {
    rules: [ // 告诉webpack每一类文件需要使用什么加载器来处理
      {
          test: require.resolve('jquery'),
          use: [{
              loader: 'expose-loader',
              options: 'jQuery'
          },{
              loader: 'expose-loader',
              options: '$'
          }]
      }, {
        test   : /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      }, {
        test: /\.json$/,
        use : 'json-loader'
      }, {
        test: /\.styl$/,
        loader: 'css-loader!stylus-loader'
      }, {
        test: /\.(css|scss)$/,
        loaders: ['to-string-loader', 'style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
        //html - 为组件模板准备的加载器
      }, {
        test:/\.(jpg|png|gif)$/,
        use:"file-loader"
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use : "url-loader?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use : "file-loader"
      }
    ]
  },
  plugins: [
    //拷贝资源
    new CopyWebpackPlugin([{
        from: helpers.root('web_modules/layer/skin'),
        to: 'skin'
    },{
        from: helpers.root('src/assets'),
        to: 'assets'
    }]),
    //热替换
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'polyfills']
      //多个html共用一个js文件，提取公共代码
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
      // 自动向目标.html文件注入script和link标签
    })
  ]
};
