const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: [
        '.js',
        '.jsx',
        '.vue',
        '.json',
        '.ts',
        '.tsx'
      ],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'static': path.resolve(__dirname, '../static')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.css$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: { minimize: true }
                }
              ],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader?sourceMap']
      },
      {
        test: /\.scss$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: { minimize: true }
                },
                'sass-loader'
              ],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      },
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
    : [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin()
      ]
}
