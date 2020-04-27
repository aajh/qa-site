import React, { useEffect } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../slices/userSlice';
import { RootState } from '../slices';

interface LoginModalProps {
    show: boolean
    onClose: () => void
}

interface LoginForm {
    username: string
    password: string
}

export default function LoginModal({ show, onClose }: LoginModalProps) {
    const dispatch = useDispatch();
    const {
        user,
        loggingIn,
        wrongPasswordOrUsername,
        loginError
    } = useSelector((state: RootState) => state.user);
    const { register, handleSubmit, errors } = useForm<LoginForm>();

    // Close the modal when the user logs in.
    useEffect(() => {
        if (user !== null) {
            onClose();
        }
    }, [user]);

    async function onSubmit(loginInformation: LoginForm) {
        dispatch(login(loginInformation));
    }

    return (
        <Modal show={show} onHide={onClose}>
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
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" form="login-form" disabled={loggingIn}>
                    {loggingIn
                        ? [
                            <span key={0} className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />,
                            'Logging In'
                        ]
                        : 'Login'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
