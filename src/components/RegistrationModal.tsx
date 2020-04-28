import React, { useEffect, useRef } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { register as registerAction, closeRegistrationModal } from '../slices/userSlice';
import { RootState } from '../slices';

interface RegistrationForm {
    username: string
    password: string
}

export default function RegistrationModal() {
    const dispatch = useDispatch();
    const {
        showRegistrationModal,
        registering,
        registrationError,
        usernameInUse,
    } = useSelector((state: RootState) => state.user);
    const { register, handleSubmit, errors } = useForm<RegistrationForm>();
    const usernameEl = useRef(null);

    useEffect(() => {
        if (usernameInUse) {
            usernameEl?.current?.focus();
        }
    }, [usernameInUse, usernameEl]);

    function onSubmit(registrationInformation: RegistrationForm) {
        dispatch(registerAction(registrationInformation));
    }
    function onHide() {
        dispatch(closeRegistrationModal());
    }

    return (
        <Modal show={showRegistrationModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            name="username"
                            type="input"
                            ref={(e: HTMLInputElement) => {
                                usernameEl.current = e;
                                register(e, { required: true });
                            }}
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

                    {usernameInUse && <Alert variant="warning">Username in use. Please choose another name.</Alert>}
                    {registrationError && <Alert variant="warning">Error while registering. Please try again.</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" form="registration-form" disabled={registering}>
                    {registering
                        ? [
                            <Spinner key={0} animation="border" size="sm" className="mr-2" role="status" />,
                            'Registering'
                        ]
                        : 'Register'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
