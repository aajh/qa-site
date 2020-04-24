import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import * as api from '../api-types';
import { fetchQuestion, showQuestion, leavingQuestion, postAnswer } from '../slices/questionSlice';
import { RootState } from '../slices';

function Answer({ answer }: { answer: api.Answer }) {
    return (
        <li>
            <p>{answer.body}</p>
            <span>{answer.author}</span>
            <span>{answer.created}</span>
        </li>
    );
}

type AnswerForm = {
    author: string
    body: string
};
function AnswerForm({ questionId } : { questionId: string }) {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, reset } = useForm<AnswerForm>();
    const {
        postingAnswer,
        postingAnswerError
    } = useSelector((state: RootState) => state.question);

    async function onSubmit(answer: AnswerForm) {
        await dispatch(postAnswer({ answer, questionId }));
        reset();
    }

    const fieldRequiredError = <span>This field is required</span>;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Name</label>
            <input name="author" type="text" ref={register({ required: true })} />
            {errors.author && fieldRequiredError}

            <label>Body</label>
            <textarea name="body" ref={register({ required: true })} />
            {errors.body && fieldRequiredError}

            <input type="submit" value="Answer" disabled={postingAnswer} />

            {postingAnswer && <span>posting...</span>}
            {postingAnswerError !== null && <span>{postingAnswerError}</span>}

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
        questionDetails = (
            <div>
                <h1 key={-1}>{question.title}</h1>
                <span key={-2}>{question.created}</span>
                {
                    // eslint-disable-next-line react/no-array-index-key
                    question.body.split('\n\n').map((p, index) => <p key={index}>{p}</p>)
                }
                <span key={-3}>{question.author}</span>
                {question.answers.length > 0 && (
                    <ul>
                        {question.answers.map(a => <Answer key={a.id} answer={a} />)}
                    </ul>
                )}
                <AnswerForm questionId={id} />
            </div>
        );
    }

    return (
        <div>
            {loading && <span>Loading...</span>}
            {loadingError !== null && <span>{loadingError}</span>}
            {questionDetails}
        </div>
    );
}
