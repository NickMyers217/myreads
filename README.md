# MyReads
This is a simple react app that allow users to search for books and categorize them in different lists.

It was created for the final assessment project of Udacity's React Fundamentals course, developed by [React Training](https://reacttraining.com).

## Installation and Setup
The following shell commands will clone and run the project locally.

```sh
cd ~
git clone https://github.com/nickmyers217/myreads
cd myreads
npm install
npm start
```
The app should now be open at [localhost:3000](http://localhost:3000)


## Backend Server

The project features a backend server provided by Udacity.

The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the following methods:

### `getAll()`
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update(book, shelf)`
* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search(query, maxResults)`
* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results. 

## create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
