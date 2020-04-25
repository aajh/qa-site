import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchQuestionList } from '../slices/questionListSlice';
import { RootState } from '../slices';
import * as api from '../api-types';

type QuestionProps = {
    question: api.QuestionSummary
};

function Question({ question }: QuestionProps): React.ReactElement {
    const created = new Date(question.created).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    return (
        <li className="list-group-item">
            <h4>
                <Link to={`/questions/${question.id}`}>{question.title}</Link>
            </h4>
            <small style={{ float: 'right' }}>{`asked ${created} by ${question.author}`}</small>
        </li>
    );
}

export default function QuestionList(): React.ReactElement {
    const dispatch = useDispatch();
    const { questionList, loading, error } = useSelector((state: RootState) => state.questionList);

    useEffect(() => {
        if (questionList.length === 0) {
            dispatch(fetchQuestionList());
        }
    }, []);

    const questionListElement = !loading && questionList.length > 0
        ? <ul className="list-group">{questionList.map(q => <Question key={q.id} question={q} />)}</ul>
        : null;

    return (
        <div className="container pt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h1 className="pb-1">Questions</h1>
                    {questionListElement}
                    {loading && (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                    {error !== null && <span>{error}</span>}
                </div>
            </div>
        </div>
    );
}
