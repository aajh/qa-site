import React from 'react';
import ReactDOM from 'react-dom';
import {
    Switch,
    Route,
    NavLink
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import store, { history } from './store';

import Ask from './ask';
import Question from './question';
import QuestionList from './questionList';

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <nav>
                <NavLink exact to="/">Home</NavLink>
                <NavLink to="/questions/ask">Ask</NavLink>
            </nav>
            <Switch>
                <Route path="/questions/ask" component={Ask} />
                <Route path="/questions/:id" component={Question} />
                <Route exact path="/" component={QuestionList} />
                <Route path="*">
                    <h1>404 Not Found</h1>
                </Route>
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-container')
);
