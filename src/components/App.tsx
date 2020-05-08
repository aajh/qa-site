import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Template from './Template';
import NotFound from './NotFound';
import Ask from './Ask';
import Question from './Question';
import QuestionList from './QuestionList';

export default function App() {
    return (
        <Template>
            <Switch>
                <Route path="/questions/ask" component={Ask} />
                <Route path="/questions/:id" component={Question} />
                <Route exact path="/" component={QuestionList} />
                <Route path="*" component={NotFound} />
            </Switch>
        </Template>
    );
}
