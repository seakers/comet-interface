
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('http://localhost:8080/api/'),
        'WS_URL': JSON.stringify('ws://localhost:8080/api/'),
        'GRAPH_QL_URL': JSON.stringify('http://3.135.228.131:8080/v1/graphql'),
        'GRAPH_QL_WS_URL': JSON.stringify('ws://3.135.228.131:8080/v1/graphql'),
        'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://3.135.228.131:8080/subscriptions'),
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
      allowedHosts: [
          'comet',
          'localhost'
      ],
    proxy: {
        '/api': {
            target: 'http://brain:8000/',
            changeOrigin: true,
            ws: true
        },
        '/server': {
            target: 'http://brain:8000/',
            changeOrigin: true,
            ws: true
        },
        '/static': {
            target: 'http://brain:8000/',
            changeOrigin: true,
            ws: true
        }
    },
    contentBase: './dist',
  },
});