const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

import Config from './src/config.js';

module.exports = (env, options) => {
  const inProd = options.mode === 'production';

  return {
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      // hot: true,
      port: 3000
    },
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'all.js',
      library: Config.name
    },
    devtool: inProd ? 'source-map' : false,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false
            }
          }
        })
      ]
    },
    plugins: inProd
      ? [
          new MiniCssExtractPlugin({ filename: 'all.css' }),
          new webpack.DefinePlugin({ IS_PRODUCTION: JSON.stringify(inProd) })
        ]
      : [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.DefinePlugin({ IS_PRODUCTION: JSON.stringify(inProd) })
        ],
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }, {
        test: /\.styl$/,
        use: inProd
          ? [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  sourceMap: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [autoprefixer()],
                  sourceMap: true
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          : ['style-loader', 'css-loader?url=false', 'stylus-loader']
      }]
    }
  }
}
