import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import './main.css';

import createStore from './store';
import App from './components/App';


// eslint-disable-next-line no-underscore-dangle
const preloadedState = (window as any).__PRELOADED_STATE__;
// eslint-disable-next-line no-underscore-dangle
delete (window as any).__PRELOADED_STATE__;

const store = createStore(preloadedState);

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('react-container')
);
