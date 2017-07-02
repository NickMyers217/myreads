import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const statuses = {
    CURRENTLY_READING: { display: 'Currently Reading', value: 'currentlyReading' },
    WANT_TO_READ: { display: 'Want to Read', value: 'wantToRead', default: true },
    READ: { display: 'Read', value: 'read' }
};

ReactDOM.render(<App statuses={statuses} />, document.getElementById('root'));
