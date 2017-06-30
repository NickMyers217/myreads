import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import {BrowserRouter, Route, Link} from 'react-router-dom';

// TODO: Add proptypes too all of these components

const SearchPage = ({onBackBtnClick}) => (
  <div className="search-books">
    <div className="search-books-bar">
      <Link to="/" className="close-search" />
      <div className="search-books-input-wrapper">
        <input type="text" placeholder="Search by title or author"/>
      </div>
    </div>
    <div className="search-books-results">
      <ol className="books-grid"></ol>
    </div>
  </div>
);

const Book = ({imageLinks, title='', authors=[], width, height}) => (
  <div className="book">
    <div className="book-top">
      <div className="book-cover"
        style={{
          width: width ? width : 128,
          height: height ? height : 193,
          backgroundImage: `url("${imageLinks.thumbnail}")`
        }}>
      </div>
      <div className="book-shelf-changer">
        <select>
          <option value="none" disabled>Move to...</option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    </div>
    <div className="book-title">{title}</div>
    <div className="book-authors">{authors.join(', ')}</div>
  </div>
);

const BookShelf = ({title, books}) => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{title}</h2>
    <div className="bookshelf-books">
      <ol className="books-grid">
        {books.map((b, i) => <li key={i}>{Book(b)}</li>)}
      </ol>
    </div>
  </div>
);

class BooksApp extends React.Component {
  state = {
    searchPhrase: 'Redux',
    books: {
      currentlyReading: [],
      wantToRead: [],
      read: []
    }
  }

  searchForBooks() {
    BooksAPI.search(this.state.searchPhrase, 5)
            .then(books =>
              this.setState(prevState => ({
                ...prevState,
                books: {...prevState.books, wantToRead: books}
              })));
  }

  componentDidMount() {
    this.searchForBooks();
  }

  render() {
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
                  <BookShelf title='Currently Reading' books={this.state.books.currentlyReading} />
                  <BookShelf title='Want to Read' books={this.state.books.wantToRead} />
                  <BookShelf title='Read' books={this.state.books.read} />
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
