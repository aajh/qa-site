import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';

import { RootState } from '../slices';
import { logout, showLoginModal, showRegistrationModal } from '../slices/userSlice';
import { fetchQuestionList } from '../slices/questionListSlice';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';

export default function Template({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const {
        questionList,
        loading: loadingQuestionList
    } = useSelector((state: RootState) => state.questionList);
    const { user } = useSelector((state: RootState) => state.user);

    function onHomeClick() {
        // If questionList.length === 0, QuestionList initiates loading.
        if (!loadingQuestionList && questionList.length !== 0) {
            dispatch(fetchQuestionList());
        }
    }

    function onShowRegistrationModal() {
        dispatch(showRegistrationModal());
    }
    function onShowLoginModal() {
        dispatch(showLoginModal());
    }
    function onLogout() {
        dispatch(logout());
    }

    return (
        <div>
            <Navbar variant="dark" bg="dark">
                <Container>
                    <Link to="/" onClick={onHomeClick} className="navbar-brand">QA</Link>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">
                            <NavLink exact to="/" onClick={onHomeClick} className="nav-item nav-link">Home</NavLink>
                            <NavLink to="/questions/ask" className="nav-item nav-link">Ask</NavLink>
                        </Nav>
                        <Nav>
                            {user !== null && (
                                <Navbar.Text className="mr-3">{`Logged in as ${user.username}`}</Navbar.Text>
                            )}
                            {user !== null
                                ? <Button onClick={onLogout}>Logout</Button>
                                : <Button onClick={onShowLoginModal} className="mr-3" variant="secondary">Login</Button>}
                            {user === null && (
                                <Button onClick={onShowRegistrationModal}>Register</Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
            <LoginModal />
            <RegistrationModal />
        </div>
    );
}
