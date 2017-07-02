import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
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
          onChange={onKeyUp} />
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

class BooksApp extends React.Component {
  state = {
    searchPhrase: '',
    searchResults: [],
    books: []
  };

  constructor(props) {
    super(props);
    this.changeBookStatus = this.changeBookStatus.bind(this);
    this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
  }

  componentWillMount() {
    this.setState(prevState => ({ ...prevState, statuses: this.props.statuses }));
    // TODO: Use localstorage to retrieve books that may be in there
  }

  searchForBooks() {
    const defaultStatus = Object.keys(this.state.statuses)
      .map(k => this.state.statuses[k])
      .filter(status => status.default)
      .shift();


    // TODO: Put these books on the search page instead
    BooksAPI.search(this.state.searchPhrase)
      .then(books =>
        books.map(book => ({
          ...book,
          status: defaultStatus
        })))
      .then(books =>
        this.setState(prevState => ({
          ...prevState,
          books
        })));
  }

  // TODO: Adding books and moving them into localStorage

  updateSearchPhrase(e) {
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      searchPhrase: e.target.value
    }), this.searchForBooks);
  }

  getBooksInStatus(status) {
    return this.state.books.filter(b => b.status === status);
  }

  changeBookStatus(bookId) {
    return newStatusValue => {
      let books = [];

      if (newStatusValue === 'none') {
        books = this.state.books.filter(b => b.id !== bookId);
      } else {
        const newStatus = Object.keys(this.state.statuses)
          .map(k => this.state.statuses[k])
          .filter(status => status.value === newStatusValue)
          .shift();

        books = this.state.books
          .map(book => (
            book.id === bookId
              ? { ...book, status: newStatus }
              : book
          ));
      }

      this.setState(prevState => ({ ...prevState, books }));
    };
  }

  render() {
    const { statuses, searchPhrase } = this.state;
    return (
      <BrowserRouter>
        <div className="app">
          <Route exact path='/search' render={() =>
            <SearchPage
              searchPhrase={searchPhrase}
              onKeyUp={this.updateSearchPhrase} />
          } />
          <Route exact path='/' render={() =>
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
                      books={this.getBooksInStatus(statuses[k])}
                      statuses={statuses}
                      onBookStatuschange={this.changeBookStatus} />)}
                </div>
              </div>
              <div className="open-search">
                <Link to='/search'>Add a book</Link>
              </div>
            </div>
          } />
        </div>
      </BrowserRouter>
    );
  }
};
BooksApp.propTypes = {
  statuses: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    default: PropTypes.bool
  })).isRequired
};

export default BooksApp;
