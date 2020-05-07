import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import './main.css';

import createStoreAndHistory from './store';
import App from './components/App';


// eslint-disable-next-line no-underscore-dangle
const preloadedState = (window as any).__PRELOADED_STATE__;
// eslint-disable-next-line no-underscore-dangle
delete (window as any).__PRELOADED_STATE__;

const { store, history } = createStoreAndHistory(preloadedState);

ReactDOM.hydrate(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-container')
);
