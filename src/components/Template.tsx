import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';

import { RootState } from '../slices';
import { logout } from '../slices/userSlice';
import { fetchQuestionList } from '../slices/questionListSlice';
import LoginModal from './LoginModal';

export default function Template({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { questionList } = useSelector((state: RootState) => state.questionList);
    const { user } = useSelector((state: RootState) => state.user);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const loggedIn = user !== null;

    function onHomeClick() {
        if (questionList.length !== 0) {
            dispatch(fetchQuestionList());
        }
    }

    function onCloseLoginModal() {
        setShowLoginModal(false);
    }
    function onShowLoginModal() {
        setShowLoginModal(true);
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
                            {loggedIn && (
                                <Navbar.Text className="logged-in-text">{`Logged in as ${user.username}`}</Navbar.Text>
                            )}
                            {loggedIn
                                ? <Button onClick={onLogout}>Logout</Button>
                                : <Button onClick={onShowLoginModal}>Login</Button>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
            <LoginModal show={showLoginModal} onClose={onCloseLoginModal} />
        </div>
    );
}
