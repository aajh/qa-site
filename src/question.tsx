import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import * as api from './api-types';

export default function Question() {
    const history = useHistory();
    const { id } = useParams();
    const [question, setQuestion] = useState(null as null | api.Question);

    useEffect(() => {
        async function fetchQuestion() {
            const response = await fetch(`/api/questions/${id}`);
            if (response.status === 404) {
                history.push('/404');
                return;
            }
            const question: api.Question = await response.json();
            setQuestion(question);
        }
        fetchQuestion();
    }, [id])

    let question_details = null;
    if (question !== null) {
        question_details = [
            <span key={-1}>{question.created}</span>,
            ...question.body.split('\n\n').map((p, index) => <p key={index}>{p}</p>),
            <span key={-2}>{question.author}</span>,
        ];
    }

    return (
        <div>
            <h1>Question</h1>
            <span>{id}</span>
            {question_details}
        </div>
    )
}