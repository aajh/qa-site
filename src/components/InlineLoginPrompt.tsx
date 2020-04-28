import React from 'react';
import { Alert, Button, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { showLoginModal } from '../slices/userSlice';

interface InlineLoginPromptProps {
    message: string
}

export default function InlineLoginPrompt({ message }: InlineLoginPromptProps) {
    const dispatch = useDispatch();

    function onShowLoginModal() {
        dispatch(showLoginModal());
    }
    return (
        <div>
            <Alert variant="info">{message}</Alert>
            <Row className="justify-content-center">
                <Button onClick={onShowLoginModal}>Login</Button>
            </Row>
        </div>
    );
}
