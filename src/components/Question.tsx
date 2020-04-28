import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { Alert, Button, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap';

import * as api from '../api/types';
import { fetchQuestion, showQuestion, leavingQuestion, postAnswer } from '../slices/questionSlice';
import { RootState } from '../slices';

import InlineLoginPrompt from './InlineLoginPrompt';

function AnswerItem({ answer }: { answer: api.Answer }) {
    const created = new Date(answer.created).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    return (
        <ListGroup.Item>
            <ReactMarkdown source={answer.body} />
            <small style={{ float: 'right' }}>{`answered ${created} by ${answer.author}`}</small>
        </ListGroup.Item>
    );
}

type AnswerForm = {
    body: string
};
function AnswerForm({ questionId } : { questionId: string }) {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, reset, watch } = useForm<AnswerForm>();
    const {
        postingAnswer,
        postingAnswerError
    } = useSelector((state: RootState) => state.question);
    const [shouldResetForm, setShouldResetForm] = useState(false);

    const body = watch('body');

    useEffect(() => {
        if (shouldResetForm && !postingAnswerError) {
            reset();
        }
        setShouldResetForm(false);
    }, [postingAnswerError, shouldResetForm]);

    async function onSubmit(answer: AnswerForm) {
        await dispatch(postAnswer({ answer, questionId }));
        setShouldResetForm(true);
    }

    return (
        <Form id="answer-form" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
                <h4>Your Answer</h4>
            </Form.Group>

            <Form.Group controlId="body">
                <Form.Label>Body</Form.Label>
                <Form.Control
                    name="body"
                    as="textarea"
                    ref={register({ required: true })}
                    isInvalid={!!errors.body}
                />
                {errors.body && (
                    <Form.Control.Feedback type="invalid">Body is required.</Form.Control.Feedback>
                )}
            </Form.Group>

            {postingAnswerError && <Alert variant="warning">Error while submitting the answer. Please try again.</Alert>}

            <Form.Group>
                <Button type="submit" disabled={postingAnswer}>
                    {postingAnswer
                        ? [
                            <Spinner key={0} animation="border" size="sm" className="mr-2" role="status" />,
                            'Submitting Answer'
                        ]
                        : 'Submit Answer'}
                </Button>
            </Form.Group>

            {body && (
                <div>
                    <h3 className="pt-3">Answer Preview</h3>
                    <hr />
                    <ReactMarkdown source={body} />
                </div>
            )}
        </Form>
    );
}

export default function Question() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { question, loading, questionWasPosted, loadingError } = useSelector(
        (state: RootState) => state.question
    );
    const loggedIn = useSelector((state: RootState) => state.user.user) !== null;

    useEffect(() => {
        if (question?.id !== id || !questionWasPosted) {
            dispatch(fetchQuestion({ id }));
        }
        dispatch(showQuestion(id));
        return () => {
            dispatch(leavingQuestion());
        };
    }, []);

    let questionDetails = null;
    if (!loading && question !== null) {
        const created = new Date(question.created).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        questionDetails = (
            <div>
                <Row>
                    <Col>
                        <h2>{question.title}</h2>
                    </Col>
                </Row>
                <Row className="pt-3">
                    <Col>
                        <ReactMarkdown source={question.body} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <small style={{ float: 'right' }}>{`asked ${created} by ${question.author}`}</small>
                    </Col>
                </Row>
                {question.answers.length > 0 && (
                    <Row className="pt-5">
                        <Col>
                            <h4>{`${question.answers.length} answer${question.answers.length > 1 ? 's' : ''}`}</h4>
                            <ListGroup variant="flush">
                                {question.answers.map(a => <AnswerItem key={a.id} answer={a} />)}
                            </ListGroup>
                        </Col>
                    </Row>
                )}
                <Row className="justify-content-center pb-5">
                    <Col md="8">
                        {loggedIn
                            ? <AnswerForm questionId={id} />
                            : <InlineLoginPrompt message="Please login to answer a question" />}
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <Container className="pt-5">
            {loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            )}
            {loadingError && <Alert variant="warning">Error while loading the question. Please try to refresh the page.</Alert>}
            {questionDetails}
        </Container>
    );
}
