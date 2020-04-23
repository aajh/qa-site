import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from 'react-router-dom';

import Ask from './ask';
import Question from './question';
import Questions from './questions';

ReactDOM.render(
    <Router>
        <nav>
            <NavLink exact to="/">Home</NavLink>
            <NavLink to="/questions/ask">Ask</NavLink>
        </nav>
        <Switch>
            <Route path="/questions/ask" component={Ask} />
            <Route path="/questions/:id" component={Question} />
            <Route exact path="/" component={Questions} />
            <Route path="*">
                <h1>404 Not Found</h1>
            </Route>
        </Switch>
    </Router>,
    document.getElementById('react-container')
);
