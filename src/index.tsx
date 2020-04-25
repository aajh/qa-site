import React from 'react';
import ReactDOM from 'react-dom';
import {
    Switch,
    Route,
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './main.css';

import store, { history } from './store';

import Template from './components/Template';
import NotFound from './components/NotFound';
import Ask from './components/Ask';
import Question from './components/Question';
import QuestionList from './components/QuestionList';

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Template>
                <Switch>
                    <Route path="/questions/ask" component={Ask} />
                    <Route path="/questions/:id" component={Question} />
                    <Route exact path="/" component={QuestionList} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Template>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-container')
);
