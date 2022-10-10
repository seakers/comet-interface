
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('http://brain.comet:8000/api/'),
        'WS_URL': JSON.stringify('ws://brain.comet:8000/api/'),
        'GRAPH_QL_URL': JSON.stringify('http://graphql.comet:8080/v1/graphql'),
        'GRAPH_QL_WS_URL': JSON.stringify('ws://graphql.comet:8080/v1/graphql'),
        'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://graphql.comet:8080/subscriptions'),
    })
  ],
});