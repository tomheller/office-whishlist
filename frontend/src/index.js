import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import App from './components/app';
import reducers from './reducers';
import owl, {owlMiddleware} from './owl/socket';
require('./css/app.css');

const initialState = {
  searchresults: [],
  tracklist: [],
  playstate: {
    track: undefined,
    playstate: undefined,
    volume: undefined,
    time: undefined,
  }
};
const createStoreWithMiddleware = applyMiddleware(owlMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers(initialState));

owl(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('app'));
