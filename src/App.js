import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';

// TODO: Add proptypes too all of these components

const SearchPage = ({onBackBtnClick}) => (
    <div className="search-books">
        <div className="search-books-bar">
            <a className="close-search" onClick={onBackBtnClick}>Close</a>
            <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author"/>
            </div>
        </div>
        <div className="search-books-results">
            <ol className="books-grid"></ol>
        </div>
    </div>
);

const Book = ({image, title, author, width, height}) => (
    <div className="book">
        <div className="book-top">
            <div className="book-cover"
                 style={{
                     width: width ? width : 128,
                     height: height ? height : 193,
                     backgroundImage: `url("${image}")`
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
        <div className="book-authors">{author}</div>
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

const testBookData = {
    image: "http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api",
    title: 'To Kill a Mocking Bird',
    author: 'Harper Lee'
};

class BooksApp extends React.Component {
    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        showSearchPage: true
    }

    render() {
        return (
            <div className="app">
                {this.state.showSearchPage ? (
                     <SearchPage onBackBtnClick={() => this.setState({ showSearchPage: false })} />
                ) : (
                     <div className="list-books">
                         <div className="list-books-title">
                             <h1>MyReads</h1>
                         </div>
                         <div className="list-books-content">
                             <div>
                                 <BookShelf title='Currently Reading' books={[testBookData, testBookData]} />
                                 <BookShelf title='Want to Read' books={[testBookData, testBookData]} />
                                 <BookShelf title='Read' books={[testBookData, testBookData]} />
                             </div>
                         </div>
                         <div className="open-search">
                             <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
                         </div>
                     </div>
                )}
            </div>
        );
    }
};

export default BooksApp;
