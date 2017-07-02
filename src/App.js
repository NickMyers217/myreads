import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
