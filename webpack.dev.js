
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
        'API_URL': JSON.stringify('http://localhost:8181/log/'),
        'WS_URL': JSON.stringify('ws://localhost:8181/log/')
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 8181,
    proxy: {
        '/log': {
            target: 'http://127.0.0.1:8005/',
            changeOrigin: true,
            ws: true
        }
    },
    contentBase: './dist',
  },
});