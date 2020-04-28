import React from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { login, closeLoginModal } from '../slices/userSlice';
import { RootState } from '../slices';

interface LoginForm {
    username: string
    password: string
}

export default function LoginModal() {
    const dispatch = useDispatch();
    const {
        showLoginModal,
        loggingIn,
        wrongPasswordOrUsername,
        loginError
    } = useSelector((state: RootState) => state.user);
    const { register, handleSubmit, errors } = useForm<LoginForm>();

    function onSubmit(loginInformation: LoginForm) {
        dispatch(login(loginInformation));
    }
    function onHide() {
        dispatch(closeLoginModal());
    }

    return (
        <Modal show={showLoginModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            name="username"
                            type="input"
                            ref={register({ required: true })}
                            isInvalid={!!errors.username}
                            autoComplete="username"
                        />
                        { errors.username && (
                            <Form.Control.Feedback type="invalid">Username is required.</Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            ref={register({ required: true })}
                            isInvalid={!!errors.password}
                            autoComplete="current-password"
                        />
                        { errors.password && (
                            <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
                        )}
                    </Form.Group>

                    {wrongPasswordOrUsername && <Alert variant="warning">Wrong username or password. Please try again.</Alert>}
                    {loginError && <Alert variant="warning">Error while logging in. Please try again.</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" form="login-form" disabled={loggingIn}>
                    {loggingIn
                        ? [
                            <Spinner key={0} animation="border" size="sm" className="mr-2" role="status" />,
                            'Logging In'
                        ]
                        : 'Login'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
