import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import * as BooksAPI from './BooksAPI';
import './App.css';
import SearchPage from './SearchPage';
import LibraryPage from './LibraryPage';

class BooksApp extends React.Component {
  static propTypes = {
    statuses: PropTypes.objectOf(PropTypes.shape({
      display: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  }

  state = {
    searchPhrase: '',
    searchResults: [],
    books: []
  }

  constructor(props) {
    super(props);
    this.addNewBookFromSearchResults = this.addNewBookFromSearchResults.bind(this);
    this.bookIsNotInLibrary = this.bookIsNotInLibrary.bind(this);
    this.changeBookStatus = this.changeBookStatus.bind(this);
    this.defaultBookStatus = this.defaultBookStatus.bind(this);
    this.updateSearchPhrase = this.updateSearchPhrase.bind(this);
  }

  componentWillMount() {
    const { statuses } = this.props;

    this.setState(prevState => ({
      ...prevState,
      statuses
    }), this.getBooksFromServer);
  }

  addNewBookFromSearchResults(bookId) {
    return newStatusValue => {
      const { searchResults } = this.state;
      const book = this.getBookById(bookId, searchResults);
      const newStatus = this.getStatusByValue(newStatusValue);
      const newBook = { ...book, status: newStatus };

      if (book && newStatusValue !== 'none' && this.bookIsNotInLibrary(bookId)) {
        this.setState(prevState => ({
          ...prevState,
          searchResults: prevState.searchResults.filter(b => b.id !== bookId),
          books: prevState.books.concat([newBook])
        }), () => this.updateBookOnServer(newBook));
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
      const book = this.getBookById(bookId, this.state.books);
      const newBook = this.defaultBookStatus({ ...book, shelf: newStatusValue });
      const books = this.state.books
        .map(book => book.id === bookId ? newBook : book);
      
      this.updateBookOnServer(newBook)
        .then(this.setState(prevState => ({ ...prevState, books })));
    };
  }

  defaultBookStatus(book) {
    if (book.hasOwnProperty('shelf')) {
      const status = this.getStatusByValue(book.shelf);
      if (status) {
        return { ...book, status };
      }
    }
    return { ...book, status: { display: 'none', value: 'none' } };
  }

  getBookById(bookId, list) {
    return list
      .filter(book => book.id === bookId)
      .shift();
  }

  getBooksFromServer() {
    BooksAPI.getAll()
      .then(books => books.map(this.defaultBookStatus))
      .then(books => this.setState(prevState => ({
        ...prevState,
        books
      })));
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
      searchResults.map(this.defaultBookStatus);
    const updateState = searchResults =>
      this.setState(prevState => ({
        ...prevState,
        searchResults
      }));

    return BooksAPI.search(searchPhrase)
      .then(filterSearchResultsForBooksAlreadyAdded)
      .then(addDefaultStatusToResults)
      .then(updateState);
  }

  updateBookOnServer(book) {
    const newShelf = book.status && book.status.value
      ? book.status.value
      : 'none';
    return BooksAPI.update(book, newShelf);
  }

  updateSearchPhrase(e) {
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      searchPhrase: e.target.value
    }), this.searchForBooks);
  }

  render() {
    const { books, statuses, searchPhrase, searchResults } = this.state;
    return (
      <div className="app">
        <Route exact path='/' render={() =>
          <LibraryPage
            statuses={statuses}
            books={books}
            onBookStatuschange={this.changeBookStatus} />
        } />
        <Route exact path='/search' render={() =>
          <SearchPage
            searchPhrase={searchPhrase}
            searchResults={searchResults}
            statuses={statuses}
            onKeyUp={this.updateSearchPhrase}
            onBookStatuschange={this.addNewBookFromSearchResults} />
        } />
      </div>
    );
  }
};

export default BooksApp;
