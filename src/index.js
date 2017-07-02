import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';

const statuses = {
  CURRENTLY_READING: { display: 'Currently Reading', value: 'currentlyReading' },
  WANT_TO_READ: { display: 'Want to Read', value: 'wantToRead' },
  READ: { display: 'Read', value: 'read' }
};

ReactDOM.render(
  <BrowserRouter>
    <App statuses={statuses} />
  </BrowserRouter>,
  document.getElementById('root'));
