
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('http://localhost:8181/log/'),
        'WS_URL': JSON.stringify('ws://localhost:8181/log/'),
        'GRAPH_QL_URL': JSON.stringify('http://localhost:6002/v1/graphql'),
        'GRAPH_QL_WS_URL': JSON.stringify('ws://localhost:6002/v1/graphql'),
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8181,
    proxy: {
        '/log': {
            target: 'http://127.0.0.1:8181/',
            changeOrigin: true,
            ws: true
        },
        '/api': {
            target: 'http://brain:8000/',
            changeOrigin: true,
            ws: true
        },
    },
    contentBase: './dist',
  },
});