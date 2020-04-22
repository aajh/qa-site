import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as api from './api-types';

type QuestionProps = {
    question: api.QuestionSummary
}

function Question({ question }: QuestionProps): React.ReactElement {
    return (
        <li>
            <h2>{question.title}</h2>
            <span>{question.created}</span>
            <span>{question.author}</span>
            <Link to={`/questions/${question.id}`}>Go-to</Link>
        </li>
    )
}

export default function Questions(): React.ReactElement {
    const [questions, setQuestions] = useState([] as api.QuestionSummary[]);

    useEffect(() => {
        async function fetchQuestions() {
            const response = await fetch('/api/questions');
            const questions: api.QuestionSummary[] = await response.json();
            setQuestions(questions);
        }
        fetchQuestions();
    }, []);

    return (
        <div>
            <h1>Q&A</h1>
            <ul>
                {questions.map(q => <Question key={q.id} question={q} />)}
            </ul>
        </div>
    );
}
