import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Book from './Book';

const SearchPage = ({ searchPhrase, searchResults, statuses, onKeyUp, onBookStatuschange }) => (
  <div className="search-books">
    <div className="search-books-bar">
      <Link to="/" className="close-search" />
      <div className="search-books-input-wrapper">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchPhrase}
          onChange={onKeyUp}
          autoFocus />
      </div>
    </div>
    <div className="search-books-results">
      <ol className="books-grid">
        {searchResults.map(book =>
          <li key={book.id}>
            <Book
              book={book}
              statuses={statuses}
              onStatusChange={onBookStatuschange} />
          </li>)}
      </ol>
    </div>
  </div>
);
SearchPage.propTypes = {
  searchPhrase: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  statuses: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    default: PropTypes.bool
  })).isRequired,
  onKeyUp: PropTypes.func.isRequired,
  onBookStatuschange: PropTypes.func.isRequired
};

export default SearchPage;