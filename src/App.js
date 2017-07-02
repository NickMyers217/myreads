import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as BooksAPI from './BooksAPI';
import './App.css';
import SearchPage from './SearchPage';
import BookShelf from './BookShelf';

class BooksApp extends React.Component {
  state = {
    searchPhrase: '',
    searchResults: [],
    books: []
  };

  constructor(props) {
    super(props);
    this.addNewBookFromSearchResults = this.addNewBookFromSearchResults.bind(this);
    this.bookIsNotInLibrary = this.bookIsNotInLibrary.bind(this);
    this.changeBookStatus = this.changeBookStatus.bind(this);
    this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
  }

  // Override
  componentWillMount() {
    this.setState(prevState => ({ ...prevState, statuses: this.props.statuses }));
    // TODO: Use localstorage to retrieve state if it exists
  }

  addNewBookFromSearchResults(bookId) {
    return newStatusValue => {
      const { searchResults } = this.state;
      const book = this.getBookById(bookId, searchResults);
      const newStatus = this.getStatusByValue(newStatusValue);

      if (book && newStatusValue !== 'none' && this.bookIsNotInLibrary(bookId)) {
        this.setState(prevState => ({
          ...prevState,
          searchResults: prevState.searchResults.filter(b => b.id !== bookId),
          books: prevState.books.concat([{ ...book, status: newStatus }])
        }));
      }
    };
  }

  bookIsInLibrary(bookId) {
    return this.state.books
      .filter(book => book.id === bookId)
      .length > 0;
  }

  bookIsNotInLibrary(bookId) {
    return !this.bookIsInLibrary(bookId);
  }

  changeBookStatus(bookId) {
    return newStatusValue => {
      let books = [];

      if (newStatusValue === 'none') {
        books = this.state.books.filter(b => b.id !== bookId);
      } else {
        books = this.state.books
          .map(book => (
            book.id === bookId
              ? { ...book, status: this.getStatusByValue(newStatusValue) }
              : book
          ));
      }

      this.setState(prevState => ({ ...prevState, books }));
    };
  }

  getBookById(bookId, list) {
    return list
      .filter(book => book.id === bookId)
      .shift();
  }

  getBooksInStatus(status) {
    return this.state.books.filter(b => b.status === status);
  }

  getStatusByValue(value) {
    return Object.keys(this.state.statuses)
      .map(k => this.state.statuses[k])
      .filter(status => status.value === value)
      .shift();
  }

  searchForBooks() {
    const { searchPhrase } = this.state;
    const filterSearchResultsForBooksAlreadyAdded = searchResults => 
      searchResults.filter(book => this.bookIsNotInLibrary(book.id));
    const addDefaultStatusToResults = searchResults =>
      searchResults.map(book => ({
        ...book,
        status: { display: 'none', value: 'none' }
      }));
    const updateState = searchResults =>
      this.setState(prevState => ({
        ...prevState,
        searchResults
      }))

    BooksAPI.search(searchPhrase)
      .then(filterSearchResultsForBooksAlreadyAdded)
      .then(addDefaultStatusToResults)
      .then(updateState);
  }

  updateSearchPhrase(e) {
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      searchPhrase: e.target.value
    }), this.searchForBooks);
  }

  // Override
  render() {
    const { statuses, searchPhrase, searchResults } = this.state;
    return (
      <BrowserRouter>
        <div className="app">
          <Route exact path='/search' render={() =>
            <SearchPage
              searchPhrase={searchPhrase}
              searchResults={searchResults}
              statuses={statuses}
              onKeyUp={this.updateSearchPhrase}
              onBookStatuschange={this.addNewBookFromSearchResults} />
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
