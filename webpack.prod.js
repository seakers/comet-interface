
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
        // 'API_URL': JSON.stringify('https://comet-services.selva-research.com:443/api/'), // PROD
        // 'WS_URL': JSON.stringify('wss://comet-services.selva-research.com:443/api/'),    // PROD
        'API_URL': JSON.stringify('http://comet-services.selva-research.com:8000/api/'), // PROD 2
        'WS_URL': JSON.stringify('ws://comet-services.selva-research.com:8000/api/'),    // PROD 2
        'GRAPH_QL_URL': JSON.stringify('http://3.133.157.232:8080/v1/graphql'),
        'GRAPH_QL_WS_URL': JSON.stringify('ws://3.133.157.232:8080/v1/graphql'),
        'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://3.133.157.232:8080/subscriptions'),
    })
  ],
});