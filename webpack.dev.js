
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('https://comet.selva-research.com/dev/api/'),
        'WS_URL': JSON.stringify('wss://comet.selva-research.com/dev/api/'),
        'GRAPH_QL_URL': JSON.stringify('https://comet.selva-research.com/graphql/v1/graphql'),
        'GRAPH_QL_WS_URL': JSON.stringify('wss://comet.selva-research.com/graphql/v1/graphql'),
        'GRAPH_QL_WS_URL_SUB': JSON.stringify('wss://comet.selva-research.com/graphql/subscriptions'),
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: 'localhost',
      allowedHosts: [
          'comet',
          'localhost'
      ],
    proxy: {
        '/api': {
            target: 'http://localhost:8000/',
            changeOrigin: true,
            ws: true
        },
        '/server': {
            target: 'http://localhost:8000/',
            changeOrigin: true,
            ws: true
        },
        '/static': {
            target: 'http://localhost:8000/',
            changeOrigin: true,
            ws: true
        }
    },
    contentBase: './dist',
  },
});