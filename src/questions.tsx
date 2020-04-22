import React from 'react';
import {useState, useEffect} from 'react';

import * as api from './api-types';

type QuestionProps = {
    question: api.QuestionSummary
}

function Question({ question }: QuestionProps): React.ReactElement {
    return (
        <li>
            <h2>{ question.title }</h2>
            <span>{ question.created }</span>
            <span>{ question.questioner }</span>
        </li>
    )
}

function Questions(): React.ReactElement {
    const [questions, setQuestions] = useState([] as api.QuestionSummary[]);

    useEffect(() => {
        async function fetch_questions() {
            const response = await fetch('/api/questions');
            const questions: api.QuestionSummary[] = await response.json();
            setQuestions(questions);
        }
        fetch_questions();
    }, []);

    return (
        <div>
            <h1>Q&A</h1>
            <ul>
                { questions.map(q => <Question key={q.id} question={q} />) }
            </ul>
        </div>
    );
}

export default Questions