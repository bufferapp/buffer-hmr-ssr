import express from 'express';
import webpack from 'webpack';
import compression from 'compression';

import {getDotenv} from '../universal/utils/dotenv';

import devConfig from '../../webpack/webpack.config.dev';

import createSSR from './createSSR';

// Import .env and expand variables: Sets process.env[VARS] as a side-effect.
getDotenv();

const app  = express();
const PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;


// Hot Module Replacment
if (!PROD) {
  const compiler = webpack(devConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: devConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(compression());
  app.use('/static', express.static('build'));
}

// Catch all errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// server-side rendering
app.get('*', createSSR);

app.listen(PORT, () => {
  console.log('>>> Listening on PORT: '+PORT);
});
