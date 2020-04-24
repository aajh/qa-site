import React from 'react';
import ReactDOM from 'react-dom';
import {
    Switch,
    Route,
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import '../node_modules/normalize.css/normalize.css';

import store, { history } from './store';

import Template from './components/Template';
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
                    <Route path="*">
                        <h1>404 Not Found</h1>
                    </Route>
                </Switch>
            </Template>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-container')
);
