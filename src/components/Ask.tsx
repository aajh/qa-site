import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';

import { postQuestion } from '../slices/questionSlice';
import { RootState } from '../slices';

import InlineLoginPrompt from './InlineLoginPrompt';

type QuestionForm = {
    title: string,
    body: string
};

export default function Ask() {
    const dispatch = useDispatch();
    const {
        postingQuestion,
        postingQuestionError
    } = useSelector((state: RootState) => state.question);
    const { user } = useSelector((state: RootState) => state.user);
    const { register, handleSubmit, errors, watch } = useForm<QuestionForm>();

    const body = watch('body');

    async function onSubmit(question: QuestionForm) {
        dispatch(postQuestion(question));
    }

    const content = user !== null
        ? (
            <Form id="ask-form" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        ref={register({ required: true })}
                        isInvalid={!!errors.title}
                    />
                    {errors.title && (
                        <Form.Control.Feedback type="invalid">Title is required.</Form.Control.Feedback>
                    )}
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

                {postingQuestionError && <Alert variant="warning">Error while submitting the question. Please try again.</Alert>}

                <Form.Group className="d-flex flex-row-reverse">
                    <Button type="submit" disabled={postingQuestion}>
                        {postingQuestion
                            ? [
                                <Spinner key={0} animation="border" size="sm" className="mr-2" role="status" />,
                                'Submitting Question'
                            ]
                            : 'Submit Question'}
                    </Button>
                </Form.Group>
            </Form>
        )
        : <InlineLoginPrompt message="Please login to ask a question." />;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md="8">
                    <h1>Ask a Question</h1>
                    {content}
                    {user !== null && body && (
                        <div>
                            <h3 className="pt-3">Question Preview</h3>
                            <hr />
                            <ReactMarkdown source={body} />
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
