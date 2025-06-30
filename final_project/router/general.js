const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Complete the code for registering a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res
    .status(400)
    .json({ message: "Username and password are required" });
});

// Task 1: Complete the code for getting the list of books available in the shop under public_users.get('/',function (req, res) {.
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // CURL_TEST: curl -X GET http://localhost:5000/
  res.send(books);
});

// Task 2: Complete the code for getting the book details based on ISBN under public_users.get('/isbn/:isbn',function (req, res) {.
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  if (!books[isbn]) {
    // CURL_TEST: curl -X GET http://localhost:5000/isbn/15
    return res.status(404).json({ message: "Book not found" });
  } else {
    let book = books[isbn];
    // CURL_TEST: curl -X GET http://localhost:5000/isbn/1
    return res.send(book);
  }
  //return res.status(300).json({ message: "Yet to be implemented" });
});

// Task 3: Complete the code for getting the book details based on the author under public_users.get('/author/:author',function (req, res) {.
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "Author not found" });
  } else {
    // CURL_TEST: curl -X GET http://localhost:5000/author/Hans%20Christian%20Andersen
    return res.send(booksByAuthor);
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Task 4: Complete the code for getting the book details based on the title under public_users.get('/title/:title',function (req, res) {.
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "Title not found" });
  } else {
    // CURL_TEST: curl -X GET http://localhost:5000/title/Things%20Fall%20Apart
    return res.send(booksByTitle);
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Task 5: Complete the code for getting book reviews under public_users.get('/review/:isbn',function (req, res) {.
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    // CURL_TEST: curl -X GET http://localhost:5000/review/15
    return res.status(404).json({ message: "Review not found" });
  } else {
    let book = books[isbn];
    // CURL_TEST: curl -X GET http://localhost:5000/review/1
    return res.send(book);
  }
  //return res.status(300).json({ message: "Yet to be implemented" });
});

// ASYNC ROUTES

// Task 10: Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios.
// Get all books using async callback function
public_users.get("/async/books", function (req, res) {
  // Simulate async operation with Promise
  const getAllBooksAsync = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(books);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  };

  getAllBooksAsync()
    .then((booksData) => {
      res.status(200).json(booksData);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching books" });
    });
});

// Task 11: Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
// Get book details based on ISBN using async callback
public_users.get("/async/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBNAsync = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 100);
    });
  };

  getBookByISBNAsync(isbn)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

// Task 12: Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.
// Get book details based on Author using async callback
public_users.get("/async/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthorAsync = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = [];
          for (const isbn in books) {
            if (books[isbn].author === author) {
              matchingBooks.push({ ...books[isbn], isbn: isbn });
            }
          }
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found by this author"));
          }
        }, 100);
      });
    };

    const matchingBooks = await getBooksByAuthorAsync(author);
    res.status(200).json({ booksByAuthor: matchingBooks });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 13: Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.
// Get book details based on Title using async callback
public_users.get("/async/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitleAsync = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = [];
          for (const isbn in books) {
            if (books[isbn].title === title) {
              matchingBooks.push({ ...books[isbn], isbn: isbn });
            }
          }
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found by this title"));
          }
        }, 100);
      });
    };

    const matchingBooks = await getBooksByTitleAsync(title);
    res.status(200).json({ booksByTitle: matchingBooks });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;
