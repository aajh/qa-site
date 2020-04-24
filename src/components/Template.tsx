import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../slices';
import { fetchQuestionList } from '../slices/questionListSlice';

export default function Template({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { questionList } = useSelector((state: RootState) => state.questionList);

    function onHomeClick() {
        if (questionList.length !== 0) {
            dispatch(fetchQuestionList());
        }
    }

    return (
        <div>
            <nav>
                <NavLink exact to="/" onClick={onHomeClick}>Home</NavLink>
                <NavLink to="/questions/ask">Ask</NavLink>
            </nav>
            {children}
        </div>
    );
}
