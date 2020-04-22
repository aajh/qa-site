import React from 'react';
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom';

import * as api from './api-types';

type QuestionForm = {
    title: string,
    author: string,
    body: string
}

export default function Ask() {
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm<QuestionForm>();

    async function askQuestion(question: QuestionForm) {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        });
        const createdQuestion: api.Question = await response.json();

        history.push(`/questions/${createdQuestion.id}`);
    }

    const fieldRequiredError = <span>This field is required</span>

    return (
        <div>
            <h1>Ask a Question</h1>
            <form onSubmit={handleSubmit(askQuestion)}>
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
    )
}