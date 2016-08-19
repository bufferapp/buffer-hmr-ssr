/* eslint react/no-danger:0 */
import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import {RouterContext} from 'react-router';
import {renderToString} from 'react-dom-stream/server';

// Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  render ( ) {
    const PROD = process.env.NODE_ENV === 'production';

    const {
      title  ,
      store  ,
      assets ,
      renderProps
    } = this.props;

    const {
      app,
      vendor,
      manifest
    } = assets || {};

    const initialState = `window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}`;

    const root = PROD ? renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps}/>
      </Provider>
    ) : null;

    let rootNode = ( root ?
      <div id="root" dangerouslySetInnerHTML={{__html: root}}></div> :
      <div id="root"></div>
    );

    let manifestScript = ( PROD ?
      <script dangerouslySetInnerHTML={{__html: manifest.text}}/> :
      null
    );

    // let vendorScripts  = ( PROD ?
    //   <script src={vendor.js}/> :
    //   null
    // );

    let appScript = ( <script src={PROD ? app.js : '/static/app.js'}/> );

    let initialStateScript = (<script dangerouslySetInnerHTML={{__html: initialState}}/>);

    return (
     <html>
       <head>
         <meta charSet="utf-8"/>
         <title>{title}</title>
       </head>
       <body>
        {initialStateScript}
        {rootNode}
        {manifestScript}
        {appScript}
       </body>
     </html>
    );
  }
}
