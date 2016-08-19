import path from 'path';
import webpack from 'webpack';
import {getDotenv} from '../src/universal/utils/dotenv';
import HappyPack from 'happypack';
import autoprefixer from 'autoprefixer';

// Import .env and expand variables: Sets process.env[VARS] as a side-effect.
getDotenv( );

const root = process.cwd( );

const srcRoot       = path.join(root, 'src');
const clientRoot    = path.join(srcRoot, 'client');
const universalRoot = path.join(srcRoot, 'universal');
const clientInclude = [clientRoot, universalRoot];

const babelQuery = {
  plugins: [
    ['transform-decorators-legacy'],
    ['react-transform', {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      }, {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      }]
    }]
  ]
};
export default {
  devtool: 'eval',
  context: srcRoot,
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'client/client.js',
      'webpack-hot-middleware/client'
    ]
  },
  output: {
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': false,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.EnvironmentPlugin([
      'PROTOCOL',
      'HOST',
      'PORT'
    ]),
    new HappyPack({
      loaders: ['babel'],
      threads: 4
    })
  ],
  resolve: {
    extensions: ['.js'],
    modules: [srcRoot, 'node_modules']
  },
  node: {
    dns: 'mock',
    net: 'mock'
  },
  postcss: [ autoprefixer],
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: 'style!css!postcss',
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss!sass',
        include: clientInclude
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        query: babelQuery,
        include: clientInclude
      }
    ]
  }
}
