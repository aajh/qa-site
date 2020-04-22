import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import Question from './question';
import Questions from './questions';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/questions/:id" component={Question} />
            <Route exact path="/" component={Questions} />
            <Route path="*">
                <h1>404 Not Found</h1>
            </Route>
        </Switch>
    </Router>,
    document.getElementById('react-container')
)