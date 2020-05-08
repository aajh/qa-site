import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { Alert, Button, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap';

import * as api from '../api/types';
import { fetchQuestion, showQuestion, leavingQuestion, postAnswer, voteAnswer } from '../slices/questionSlice';
import { showLoginModal } from '../slices/userSlice';
import { RootState } from '../slices';

import InlineLoginPrompt from './InlineLoginPrompt';

const CARET_SIZE = '1.5em';

function CaretUp({ filled, onClick }: { filled: boolean, onClick: () => void }) {
    return (
        <button type="button" className="vote-up btn" onClick={onClick} style={{ padding: 0 }}>
            {
                filled
                    ? (
                        <svg className="bi bi-caret-up-fill" width={CARET_SIZE} height={CARET_SIZE} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 00.753-1.659l-4.796-5.48a1 1 0 00-1.506 0z" />
                        </svg>
                    )
                    : (
                        <svg className="bi bi-caret-up" width={CARET_SIZE} height={CARET_SIZE} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.204 11L8 5.519 12.796 11H3.204zm-.753-.659l4.796-5.48a1 1 0 011.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 01-.753-1.659z" clipRule="evenodd" />
                        </svg>
                    )
            }
        </button>
    );
}

function CaretDown({ filled, onClick }: { filled: boolean, onClick: () => void }) {
    return (
        <button type="button" className="vote-down btn" onClick={onClick} style={{ padding: 0 }}>
            {
                filled
                    ? (
                        <svg className="bi bi-caret-down-fill" width={CARET_SIZE} height={CARET_SIZE} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z" />
                        </svg>
                    )
                    : (
                        <svg className="bi bi-caret-down" width={CARET_SIZE} height={CARET_SIZE} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.204 5L8 10.481 12.796 5H3.204zm-.753.659l4.796 5.48a1 1 0 001.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 00-.753 1.659z" clipRule="evenodd" />
                        </svg>
                    )
            }
        </button>
    );
}

function AnswerItem({ answer, questionId }: { answer: api.Answer, questionId: string }) {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state: RootState) => state.user.user) !== null;

    const created = new Date(answer.created).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    function onClickUp() {
        if (!loggedIn) {
            dispatch(showLoginModal());
            return;
        }
        if (answer.voteDirection !== 1) {
            dispatch(voteAnswer({ questionId, answerId: answer.id, direction: 1 }));
        } else {
            dispatch(voteAnswer({ questionId, answerId: answer.id, direction: null }));
        }
    }
    function onClickDown() {
        if (!loggedIn) {
            dispatch(showLoginModal());
            return;
        }
        if (answer.voteDirection !== -1) {
            dispatch(voteAnswer({ questionId, answerId: answer.id, direction: -1 }));
        } else {
            dispatch(voteAnswer({ questionId, answerId: answer.id, direction: null }));
        }
    }

    return (
        <ListGroup.Item>
            <Row>
                <Col xs={2} md={1} style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 0 }}>
                    <CaretUp filled={answer.voteDirection === 1} onClick={onClickUp} />
                    <span>{answer.votes}</span>
                    <CaretDown filled={answer.voteDirection === -1} onClick={onClickDown} />
                </Col>
                <Col>
                    <ReactMarkdown source={answer.body} />
                </Col>
            </Row>
            <Row style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <small>{`answered ${created} by ${answer.author}`}</small>
            </Row>
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

            <Form.Group className="d-flex flex-row-reverse">
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
    const history = useHistory();
    const { id } = useParams();
    const { question, loading, questionWasPosted, loadingError } = useSelector(
        (state: RootState) => state.question
    );
    const loggedIn = useSelector((state: RootState) => state.user.user) !== null;

    useEffect(() => {
        if (id !== undefined) {
            if (question?.id !== id || !questionWasPosted) {
                dispatch(fetchQuestion({ id, history }));
            }
            dispatch(showQuestion(id));
        }
        return () => {
            dispatch(leavingQuestion());
        };
    }, [loggedIn]);

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
                                {question.answers.map(
                                    a => (
                                        <AnswerItem
                                            key={a.id}
                                            answer={a}
                                            questionId={question.id}
                                        />
                                    )
                                )}
                            </ListGroup>
                        </Col>
                    </Row>
                )}
                <Row className="justify-content-center pb-5">
                    <Col md="8">
                        {loggedIn && id
                            ? <AnswerForm questionId={id} />
                            : <InlineLoginPrompt message="Please login to answer the question" />}
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
