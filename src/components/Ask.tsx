import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { postQuestion } from '../slices/questionsSlice';
import { RootState } from '../slices';

type QuestionForm = {
    title: string,
    author: string,
    body: string
};

export default function Ask() {
    const dispatch = useDispatch();
    const { posting, postingError } = useSelector((state: RootState) => state.questions);
    const { register, handleSubmit, errors } = useForm<QuestionForm>();

    async function onSubmit(question: QuestionForm) {
        dispatch(postQuestion(question));
    }

    const fieldRequiredError = <span>This field is required</span>;

    return (
        <div>
            <h1>Ask a Question</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Title
                    <input name="title" type="text" ref={register({ required: true })} />
                </label>
                {errors.title && fieldRequiredError}

                <label>
                    Name
                    <input name="author" type="text" ref={register({ required: true })} />
                </label>
                {errors.author && fieldRequiredError}

                <label>
                    Body
                    <textarea name="body" ref={register({ required: true })} />
                </label>
                {errors.body && fieldRequiredError}

                <input type="submit" value="Ask" />

                { posting && <span>posting...</span>}
                { postingError !== null && <span>{postingError}</span>}
            </form>
        </div>
    );
}
