import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';

import Book from './Book';

const BookShelf = ({ title, books, statuses, onBookStatuschange }) => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{title}</h2>
    <Well>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map(book =>
            <li key={book.id}>
              <Book
                book={book}
                statuses={statuses}
                onStatusChange={onBookStatuschange} />
            </li>)}
        </ol>
      </div>
    </Well>
  </div>
);
BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  statuses: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    default: PropTypes.bool
  })).isRequired,
  onBookStatuschange: PropTypes.func.isRequired
};

export default BookShelf;