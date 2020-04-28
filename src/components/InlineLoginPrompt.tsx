import React from 'react';
import { Alert, Button, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { showLoginModal, showRegistrationModal } from '../slices/userSlice';

interface InlineLoginPromptProps {
    message: string
}

export default function InlineLoginPrompt({ message }: InlineLoginPromptProps) {
    const dispatch = useDispatch();

    function onShowLoginModal() {
        dispatch(showLoginModal());
    }
    function onShowRegistrationModal() {
        dispatch(showRegistrationModal());
    }

    return (
        <div>
            <Alert variant="info">{message}</Alert>
            <Row className="justify-content-center">
                <Button onClick={onShowLoginModal} variant="secondary" className="mr-3">Login</Button>
                <Button onClick={onShowRegistrationModal}>Register</Button>
            </Row>
        </div>
    );
}
