import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import BookShelf from './BookShelf';

const ListPage = ({ statuses, books, onBookStatuschange }) => (
  <div className="list-books">
    <div className="list-books-title">
      <h1>MyReads</h1>
    </div>
    <div className="list-books-content">
      <div>
        {Object.keys(statuses).map(k =>
          <BookShelf
            key={k}
            title={statuses[k].display}
            books={books.filter(b => b.status === statuses[k] )}
            statuses={statuses}
            onBookStatuschange={onBookStatuschange} />)}
      </div>
    </div>
    <div className="open-search">
      <Link to='/search'>Add a book</Link>
    </div>
  </div>
);
ListPage.propTypes = {
  statuses: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    default: PropTypes.bool
  })).isRequired,
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onBookStatuschange: PropTypes.func.isRequired
};

export default ListPage;
