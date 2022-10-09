
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('https://dev.selva-research.com/lgapi/'),
        'WS_URL': JSON.stringify('wss://dev.selva-research.com/lgapi/')
    })
  ],
});