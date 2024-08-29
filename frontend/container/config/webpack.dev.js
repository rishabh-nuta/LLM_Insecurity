const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { merge } = require('webpack-merge');

const packageJSON = require('../package.json');
const commonConfig = require('./webpack.common');

const devConfig = {
  entry: './src/index',
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    port: 5000,
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
    proxy: [
      {
        context: ['/api'],
        changeOrigin: true,
        target: `http://localhost:8085`,
        secure: false,
        onProxyReq: (proxyReq, req, res) => {
          // Add any custom headers or modify the request here
          proxyReq.setHeader('Access-Control-Allow-Origin', '*');
        },
      },
    ],
  },
};

module.exports = merge(commonConfig, devConfig);
