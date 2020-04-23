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
    return (
        <li>
            <h2>{question.title}</h2>
            <span>{question.created}</span>
            <span>{question.author}</span>
            <Link to={`/questions/${question.id}`}>Go-to</Link>
        </li>
    );
}

export default function QuestionList(): React.ReactElement {
    const dispatch = useDispatch();
    const questionList = useSelector((state: RootState) => state.questionList.questionList);

    useEffect(() => { dispatch(fetchQuestionList()); }, [dispatch]);

    return (
        <div>
            <h1>QA</h1>
            <ul>
                {questionList.map(q => <Question key={q.id} question={q} />)}
            </ul>
        </div>
    );
}
