import React, { useEffect, useRef } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { register as registerAction, closeRegistrationModal } from '../slices/userSlice';
import { RootState } from '../slices';

interface RegistrationForm {
    username: string
    password: string
    passwordConfirmation: string
}

export default function RegistrationModal() {
    const dispatch = useDispatch();
    const {
        showRegistrationModal,
        registering,
        registrationError,
        usernameInUse,
    } = useSelector((state: RootState) => state.user);
    const { register, handleSubmit, errors, watch } = useForm<RegistrationForm>();
    const usernameEl: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

    useEffect(() => {
        if (usernameInUse && usernameEl?.current) {
            usernameEl.current.focus();
        }
    }, [usernameInUse, usernameEl]);

    function onSubmit({ username, password }: RegistrationForm) {
        dispatch(registerAction({ username, password }));
    }
    function onHide() {
        dispatch(closeRegistrationModal());
    }

    const passwordValue = watch('password');
    function validatePasswordConfirmation(value: string) {
        return value === passwordValue;
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
                            autoComplete="new-password"
                        />
                        { errors.password && (
                            <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group controlId="passwordConfirmation">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control
                            name="passwordConfirmation"
                            type="password"
                            ref={register({
                                required: true,
                                validate: validatePasswordConfirmation
                            })}
                            isInvalid={!!errors.passwordConfirmation}
                            autoComplete="new-password"
                        />
                        { errors.passwordConfirmation?.type === 'required' && (
                            <Form.Control.Feedback type="invalid">Password confirmation is required.</Form.Control.Feedback>
                        )}
                        { errors.passwordConfirmation?.type === 'validate' && (
                            <Form.Control.Feedback type="invalid">Passwords must match.</Form.Control.Feedback>
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
