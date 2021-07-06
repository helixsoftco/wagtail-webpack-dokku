const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

const config = require('./webpack.base.config');

config.mode = 'development';

config.plugins.push(
  new BundleTracker({
    filename: './webpack-development-stats.json'
  }),
);

config.output.path = path.resolve('./assets/webpack_bundles/');
config.output.publicPath = '/static/webpack_bundles/';

config.devServer = {
  contentBase: false,
  port: 9000,
  host: '0.0.0.0',
  writeToDisk: true,
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  }
};

module.exports = config;
