import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Col, Container, ListGroup, Row, Spinner } from 'react-bootstrap';

import { fetchQuestionList } from '../slices/questionListSlice';
import { RootState } from '../slices';
import * as api from '../api/types';

type QuestionProps = {
    question: api.QuestionSummary
};

function QuestionItem({ question }: QuestionProps): React.ReactElement {
    const created = new Date(question.created).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    return (
        <ListGroup.Item>
            <h4>
                <Link to={`/questions/${question.id}`}>{question.title}</Link>
            </h4>
            <small style={{ float: 'right' }}>{`asked ${created} by ${question.author}`}</small>
        </ListGroup.Item>
    );
}

export default function QuestionList(): React.ReactElement {
    const dispatch = useDispatch();
    const { questionList, loading, error } = useSelector((state: RootState) => state.questionList);

    useEffect(() => {
        if (questionList.length === 0) {
            dispatch(fetchQuestionList());
        }
    }, []);

    const questionListElement = !loading && questionList.length > 0
        ? <ListGroup>{questionList.map(q => <QuestionItem key={q.id} question={q} />)}</ListGroup>
        : null;

    return (
        <Container className="pt-5">
            <Row className="justify-content-center">
                <Col md="10">
                    <h1 className="pb-1">Questions</h1>
                    {questionListElement}
                    {loading && (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    )}
                    {error && <Alert variant="warning">Error while loading questions. Please try to refresh the page.</Alert>}
                </Col>
            </Row>
        </Container>
    );
}
