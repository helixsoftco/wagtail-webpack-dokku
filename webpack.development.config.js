const path = require('path')
const BundleTracker = require('webpack-bundle-tracker')

const config = require('./webpack.base.config')

config.mode = 'development'

config.plugins.push(
  new BundleTracker({
    filename: './webpack-development-stats.json',
  })
)

config.output.path = path.resolve('./assets/webpack_bundles/')
config.output.publicPath = '/static/webpack_bundles/'

config.devServer = {
  port: 9000,
  hot: false,
  allowedHosts: 'all',
  devMiddleware: {
    writeToDisk: true,
  },
  client: {
    progress: true,
  },
}

module.exports = config
