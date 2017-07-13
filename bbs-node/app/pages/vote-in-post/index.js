require('./index.less');
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers'
import reducer from './reducers'
import dataStat from '../../components/stat';
// if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
//      const vconsole = require('vconsole');
// }

dataStat("post_vote_page");

const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
