const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { merge } = require('webpack-merge');
const path = require('path');

const packageJSON = require('../package.json');
const commonConfig = require('./webpack.common');

const prodConfig = {
  entry: './src/index',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      filename: 'container-remote-entry.js',
      remotes: {
        feedbackService: `promise new Promise(resolve => {
					const script = document.createElement('script');
					script.src = '/feedback-service-remote-entry.js';
					script.onload = () => {
            const module = { get: window.feedbackService.get, init: window.feedbackService.init };
            resolve(module);
					};
					document.head.appendChild(script);
        })`,
      },
      shared: packageJSON.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
