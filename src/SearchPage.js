import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SearchPage = ({ searchPhrase, onKeyUp }) => (
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
      <ol className="books-grid"></ol>
    </div>
  </div>
);
SearchPage.propTypes = {
  searchPhrase: PropTypes.string.isRequired,
  onKeyUp: PropTypes.func.isRequired
};

export default SearchPage;