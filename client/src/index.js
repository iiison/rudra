import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import io from 'socket.io-client'
import annyang from 'annyang'

import store from './configs/store'
import routes from './configs/routes'
import './index.css';
import * as serviceWorker from './serviceWorker';

export const socket = io()

if (annyang) {
  annyang.setLanguage('en-IN')
  annyang.start()
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {routes(annyang)}
    </BrowserRouter>
  </Provider>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

