const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: __dirname,
  devtool: 'source-map',

  entry: {
    app: './assets/js/app',
    vendor: './assets/js/vendor',
  },

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true,
  },

  resolve: {
    extensions: ['.js', '.ts', '.vue', '.scss'],
    alias: {
      '@': path.resolve('assets'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      // Drop Options API from bundle
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CompressionPlugin(),
    new VueLoaderPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
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
              sourceMap: true,
            },
          },
          // Make modern CSS work with old browsers
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'img/[hash][ext][query]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'media/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
}
