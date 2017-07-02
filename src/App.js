import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';

// TODO: Add proptypes too all of these components

const SearchPage = ({ onBackBtnClick }) => (
  <div className="search-books">
    <div className="search-books-bar">
      <Link to="/" className="close-search" />
      <div className="search-books-input-wrapper">
        <input type="text" placeholder="Search by title or author" />
      </div>
    </div>
    <div className="search-books-results">
      <ol className="books-grid"></ol>
    </div>
  </div>
);

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

const Book = ({ book, statuses, onStatusChange }) => {
  const { imageLinks, title = '', authors = [], width, height } = book;
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

const BookShelf = ({ title, books, statuses, onBookStatuschange }) => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{title}</h2>
    <div className="bookshelf-books">
      <ol className="books-grid">
        {books.map(book =>
          <li key={book.id}>
            <Book book={book} statuses={statuses} onStatusChange={onBookStatuschange} />
          </li>)}
      </ol>
    </div>
  </div>
);

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.changeBookStatus = this.changeBookStatus.bind(this);
    this.state = {
      searchPhrase: 'Baseball',
      statuses: props.statuses,
      books: []
    };
  }

  searchForBooks() {
    BooksAPI.search(this.state.searchPhrase, 5)
      .then(books =>
        books.map(book => ({
          ...book,
          status: this.state.statuses.WANT_TO_READ
        })))
      .then(books =>
        this.setState(prevState => ({
          ...prevState,
          books: prevState.books.concat(books)
        })));
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

  componentDidMount() {
    this.searchForBooks();
  }

  render() {
    const { statuses } = this.state;
    return (
      <BrowserRouter>
        <div className="app">
          <Route exact path='/search' component={SearchPage} />
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

export default BooksApp;
