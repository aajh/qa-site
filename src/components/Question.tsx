import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchQuestion, showQuestion, leavingQuestion } from '../slices/questionsSlice';
import { RootState } from '../slices';

export default function Question() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { question, loading, questionWasPosted, loadingError } = useSelector(
        (state: RootState) => state.questions
    );

    useEffect(() => {
        if (question?.id !== id || !questionWasPosted) {
            dispatch(fetchQuestion({ id }));
        }
        dispatch(showQuestion(id));
        return () => {
            dispatch(leavingQuestion());
        };
    }, []);

    let questionDetails = null;
    if (!loading && question !== null) {
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
            {loading && <span>Loading...</span>}
            {loadingError !== null && <span>{loadingError}</span>}
            {questionDetails}
        </div>
    );
}
