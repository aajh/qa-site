import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { postNewQuestion } from '../slices/questionsSlice';

type QuestionForm = {
    title: string,
    author: string,
    body: string
};

export default function Ask() {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm<QuestionForm>();

    async function onSubmit(question: QuestionForm) {
        dispatch(postNewQuestion(question));
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
            </form>
        </div>
    );
}
