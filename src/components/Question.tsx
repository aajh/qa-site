import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchQuestion } from '../slices/questionsSlice';
import { RootState } from '../slices';
import * as api from '../api-types';

export default function Question() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const question: api.Question = useSelector(
        (state: RootState) => state.questions.questionsById[id]
    );

    useEffect(() => { dispatch(fetchQuestion(id)); }, [id, dispatch]);

    let questionDetails = null;
    if (question !== undefined) {
        questionDetails = [
            <span key={-1}>{question.created}</span>,
            // eslint-disable-next-line react/no-array-index-key
            ...question.body.split('\n\n').map((p, index) => <p key={index}>{p}</p>),
            <span key={-2}>{question.author}</span>,
        ];
    }

    return (
        <div>
            <h1>Question</h1>
            <span>{id}</span>
            {questionDetails}
        </div>
    );
}
