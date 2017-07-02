import React from 'react';
import PropTypes from 'prop-types';

const StatusSelect = ({ statuses, value, onStatusChange }) => (
  <div className="book-shelf-changer">
    <select 
      value={value}
      onChange={e => onStatusChange(e.target.value)}>
      <option value="none" disabled>Move to...</option>
      {Object.keys(statuses).map(k =>
        <option key={k} value={statuses[k].value}>
          {statuses[k].display}
        </option>)}
      <option value="none">None</option>
    </select>
  </div>
);
StatusSelect.propTypes = {
  statuses: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    default: PropTypes.bool
  })).isRequired,
  value: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

const Book = ({ book, statuses, onStatusChange }) => {
  const { imageLinks={thumbnail: ''}, title = '', authors = [], width, height } = book;
  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{
            width: width ? width : 128,
            height: height ? height : 193,
            backgroundImage: `url("${imageLinks.thumbnail}")`
          }}>
        </div>
        <StatusSelect
          statuses={statuses}
          value={book.status.value}
          onStatusChange={onStatusChange(book.id)} />
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors.join(', ')}</div>
    </div>
  );
};
Book.propTypes = {
  book: PropTypes.object.isRequired,
  statuses: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    default: PropTypes.bool
  })).isRequired,
  onStatusChange: PropTypes.func.isRequired
};

const BookShelf = ({ title, books, statuses, onBookStatuschange }) => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{title}</h2>
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