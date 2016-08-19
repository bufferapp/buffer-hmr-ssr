import webpack from 'webpack';
import path from 'path';
import {getDotenv} from '../src/universal/utils/dotenv';

import AssetsPlugin from 'assets-webpack-plugin';
import HappyPack from 'happypack';
import autoprefixer from 'autoprefixer';

// Import .env and expand variables:
getDotenv();

const root = process.cwd();
const clientInclude = [
  path.join(root, 'src', 'client'),
  path.join(root, 'src', 'universal'),
];

/*
* Cache vendor + app on a CDN and call it a day
*/

// const vendor = [
//   'react',
//   'react-dom',
//   // 'react-router',
//   // 'react-redux',
//   // 'redux'
// ]

export default {
  context: path.join(root, 'src'),
  entry: {
    app: ['babel-polyfill', 'client/client.js'],
    // vendor
  },
  output: {
    filename: '[name]_[chunkhash].js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.join(root, 'src'), 'node_modules'],
    unsafeCache: true
  },
  node: {
    dns: 'mock',
    net: 'mock'
  },
  postcss: [autoprefixer],
  plugins: [
     // Native Webpack Plugins
     new webpack.NamedModulesPlugin(),
     new webpack.optimize.CommonsChunkPlugin({
      //  names: ['vendor', 'manifest'],
      names: ['manifest'],
       minChunks: Infinity
       // (with more entries, this ensures that no other module
       //  goes into the vendor or manifest chunk)
     }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 50000
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false},
      comments: /(?:)/
    }),
    new AssetsPlugin({
      path: path.join(root, 'build'),
      filename: 'assets.json'
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.EnvironmentPlugin([
     'PROTOCOL',
     'HOST',
     'PORT'
   ]),

   // Exteranl Plugins
   new HappyPack({
      loaders: ['babel'],
      threads: 4
    })
  ],
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: 'css-loader/locals?modules&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
        include: clientInclude
      },
      {
        test: /\.css$/,
        loader: 'css-loader/locals'
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        include: clientInclude
      }
    ]
  }
};
