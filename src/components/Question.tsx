import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import * as api from '../api/types';
import { fetchQuestion, showQuestion, leavingQuestion, postAnswer } from '../slices/questionSlice';
import { RootState } from '../slices';

function AnswerItem({ answer }: { answer: api.Answer }) {
    const created = new Date(answer.created).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    return (
        <li className="list-group-item">
            <ReactMarkdown source={answer.body} />
            <small style={{ float: 'right' }}>{`answered ${created} by ${answer.author}`}</small>
        </li>
    );
}

type AnswerForm = {
    author: string
    body: string
};
function AnswerForm({ questionId } : { questionId: string }) {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, reset, watch } = useForm<AnswerForm>();
    const {
        postingAnswer,
        postingAnswerError
    } = useSelector((state: RootState) => state.question);

    const body = watch('body');

    async function onSubmit(answer: AnswerForm) {
        await dispatch(postAnswer({ answer, questionId }));
        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <h4>Your Answer</h4>
            </div>
            <div className="form-group">
                <label htmlFor="author">Name</label>
                <input
                    name="author"
                    id="author"
                    type="text"
                    ref={register({ required: true })}
                    className={classNames('form-control', { 'is-invalid': errors.author })}
                />
                {errors.author && <div className="invalid-feedback">Name is required.</div>}
            </div>

            <div className="form-group">
                <label htmlFor="body">Body</label>
                <textarea
                    name="body"
                    id="body"
                    ref={register({ required: true })}
                    className={classNames('form-control', { 'is-invalid': errors.body })}
                />
                {errors.body && <div className="invalid-feedback">Body is required.</div>}
            </div>

            <div className="form-group">
                <button type="submit" disabled={postingAnswer} className="btn btn-primary">
                    {postingAnswer
                        ? [
                            <span key={0} className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />,
                            'Submitting Answer'
                        ]
                        : 'Submit Answer'}
                </button>
            </div>
            {postingAnswerError !== null && <span>{postingAnswerError}</span>}

            {body && (
                <div>
                    <h3 className="pt-3">Answer Preview</h3>
                    <hr />
                    <ReactMarkdown source={body} />
                </div>
            )}
        </form>
    );
}

export default function Question() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { question, loading, questionWasPosted, loadingError } = useSelector(
        (state: RootState) => state.question
    );

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
                <div className="row">
                    <div className="col">
                        <h2>{question.title}</h2>
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col">
                        <ReactMarkdown source={question.body} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <small style={{ float: 'right' }}>{`asked ${created} by ${question.author}`}</small>
                    </div>
                </div>
                {question.answers.length > 0 && (
                    <div className="row pt-5">
                        <div className="col">
                            <h4>{`${question.answers.length} answer${question.answers.length > 1 ? 's' : ''}`}</h4>
                            <ul className="list-group list-group-flush">
                                {question.answers.map(a => <AnswerItem key={a.id} answer={a} />)}
                            </ul>
                        </div>
                    </div>
                )}
                <div className="row justify-content-center pb-5">
                    <div className="col-md-8">
                        <AnswerForm questionId={id} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container pt-5">
            {loading && (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {loadingError !== null && <span>{loadingError}</span>}
            {questionDetails}
        </div>
    );
}
