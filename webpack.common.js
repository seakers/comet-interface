

const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: {
    index: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      // Mini-css-loader
      {
        test: /\.css$/i,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader'
            }
        ]
      },
      // Babel loader
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      // Vue loader
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // HTML loader
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      // Vuetify Loader
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require('sass'),
              fiber: require('fibers'),
              indentedSyntax: true // optional
            },
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true // optional
              },
            },
          },
        ],
      }
    ],
  },

  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['index'],
      filename: 'index.html'
    }),
    new VueLoaderPlugin()
  ],

  resolve: {
    extensions: ['.js', '.vue'],
  }
};