import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import { postQuestion } from '../slices/questionSlice';
import { RootState } from '../slices';

type QuestionForm = {
    title: string,
    author: string,
    body: string
};

export default function Ask() {
    const dispatch = useDispatch();
    const {
        postingQuestion,
        postingQuestionError
    } = useSelector((state: RootState) => state.question);
    const { register, handleSubmit, errors, watch } = useForm<QuestionForm>();

    const body = watch('body');

    async function onSubmit(question: QuestionForm) {
        dispatch(postQuestion(question));
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1>Ask a Question</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                name="title"
                                id="title"
                                type="text"
                                ref={register({ required: true })}
                                className={classNames('form-control', { 'is-invalid': errors.title })}
                            />
                            {errors.title && <div className="invalid-feedback">Title is required.</div>}
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
                            <button type="submit" disabled={postingQuestion} className="btn btn-primary">
                                {postingQuestion
                                    ? [
                                        <span key={0} className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />,
                                        'Submitting Question'
                                    ]
                                    : 'Submit Question'}
                            </button>
                        </div>

                        {postingQuestionError !== null && <span>{postingQuestionError}</span>}
                    </form>
                    {body && (
                        <div>
                            <h3 className="pt-3">Question Preview</h3>
                            <hr />
                            <ReactMarkdown source={body} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
