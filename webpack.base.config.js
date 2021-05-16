const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  context: __dirname,
  devtool: "source-map",

  entry: {
    app: './assets/js/app',
    vendor: './assets/js/vendor'
  },

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },

  optimization: {
    // Extract common imports between dependencies and app bundles into a modules.js file
    splitChunks: {
      chunks: 'all',
      name: 'modules',
    },
  },
  
  resolve: {
    extensions: ['.js', '.vue', '.scss'],
    alias: {
      '@': path.resolve('assets'),
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Extract css into its own file
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // Translates CSS into CommonJS to resolve css imports
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          // Make modern CSS work with old browsers
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ],
  },
}
