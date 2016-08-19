import React from 'react';
import fs from 'fs';
import promisify from 'es6-promisify';
import {join, basename} from 'path';
import {match} from 'react-router';
import {push} from 'react-router-redux';
import ReactDOMStream from 'react-dom-stream/server';
import createStore from '../universal/redux/createStore';
import Html from './Html';

function renderApp(res, store, assets, renderProps) {
  const location = renderProps &&
                   renderProps.location &&
                   renderProps.location.pathname || '/';

  // Needed so some components can render based on location
  store.dispatch(push(location));

  const stream = ReactDOMStream.renderToStaticMarkup(
    <Html store={store}
          title={"Buffer"}
          assets={assets}
          renderProps={renderProps} />
  );

  res.write('<!DOCTYPE html>');
  stream.pipe(res, {end: false});
  stream.on("end", () => res.end());
}

async function renderProductionApp(req, res, store) {
  const makeRoutes = require('../../build/prerender');
  const assets = require('../../build/assets.json');
  const readFile = promisify(fs.readFile);

  assets.manifest.text = await readFile(
    join(__dirname, '..', '..', 'build', basename(assets.manifest.js)),
    'utf-8'
  );

  const routes = makeRoutes(store);

  match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

    if (error) {
     res.status(500).send(error.message);
    } else if (redirectLocation) {
     res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
     renderApp(res, store, assets, renderProps);
    } else {
     res.status(404).send('Not found');
    }

  });
}

export default async function createSSR(req, res) {
  const PROD  = process.env.NODE_ENV === 'production';
  const store = createStore( );

  if (PROD) {
    renderProductionApp(req, res, store);
  } else {
    renderApp(res, store);
  }
}
