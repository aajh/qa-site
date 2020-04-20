import React from 'react';
import {useState, useEffect} from 'react';

function Message() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetch_message() {
            const response = await fetch('/hello');
            const message = await response.text();
            setMessage(message);
        }
        fetch_message();
    }, []);

    return (
        <div>
            <h1>Hello From React!</h1>
            <p>{message}</p>
        </div>
    );
}

export default Message