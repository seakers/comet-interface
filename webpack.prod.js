
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('http://comet-services.selva-research.com:8000/api/'), // PROD
        'WS_URL': JSON.stringify('ws://comet-services.selva-research.com:8000/api/'),    // PROD
        'GRAPH_QL_URL': JSON.stringify('http://3.135.288.131:8080/v1/graphql'),
        'GRAPH_QL_WS_URL': JSON.stringify('ws://3.135.288.131:8080/v1/graphql'),
        'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://3.135.288.131:8080/subscriptions'),
    })
  ],
});