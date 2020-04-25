import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <Link to="/" onClick={onHomeClick} className="navbar-brand">QA</Link>
                    <div className="collapse navbar-collapse">
                        <div className="navbar-nav">
                            <NavLink exact to="/" onClick={onHomeClick} className="nav-item nav-link">Home</NavLink>
                            <NavLink to="/questions/ask" className="nav-item nav-link">Ask</NavLink>
                        </div>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
