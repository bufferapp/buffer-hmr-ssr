import webpack from 'webpack';
import path    from 'path';

import HappyPack from 'happypack';

console.log('webpack.config.server');

const root = process.cwd();
const serverInclude = [
  path.join(root, 'src', 'server'),
  path.join(root, 'src', 'universal')
];

export default {
  context: path.join(root, 'src'),
  entry: {
    prerender: 'universal/routes/index.js'
  },
  target: 'node',
  output: {
    path: path.join(root, 'build'),
    chunkFilename: '[name]_[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/'
  },
  resolve: {
   extensions: ['.js'],
   modules: [path.join(root, 'src'), 'node_modules']
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.DefinePlugin({
      '__CLIENT__': false,
      '__PRODUCTION__': true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
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
        include: serverInclude,
      },
      {
        test: /\.css$/,
        loader: 'css-loader/locals',
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        include: serverInclude
      }
    ]
  }
}
