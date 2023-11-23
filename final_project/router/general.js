const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function isRegistered(username) {
  const registeredUsers = users.filter((user) => {
    return user.username === username;
  });
  return registeredUsers.length > 0;
}
// Register a new customer
public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (isRegistered(username)) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      users.push({ username: username, password: password });

      return res
        .status(200)
        .json({ message: "User registered seccessfully. Now you can login" });
    }
  } else {
    return res.status(400).json({ message: "Unable to register user" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  if (books.hasOwnProperty(ISBN)) {
    res.send(books[ISBN]);
  } else {
    res.send("There is no book with such ISBN.");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author === author;
  });
  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.send(`No books found for author ${author}.`);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => {
    return book.title === title;
  });
  if (booksByTitle.length > 0) {
    res.send(booksByTitle);
  } else {
    res.send(`No books found with title ${title}.`);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  if (books.hasOwnProperty(ISBN)) {
    res.send(books[ISBN]["reviews"]);
  } else {
    res.send("There is no book with such ISBN");
  }
});
// Task 10: Get all books – Using async callback function –
async function fetchAllBooks() {
  return books;
}
public_users.get("/", function (req, res) {
  fetchAllBooks().then(
    (books) => {
      res.send(JSON.stringify({ books }, null, 4));
    },
    (error) => {
      res.status(400).json({ message: "Error getting books" });
    }
  );
});
// Task 11: Search by ISBN – Using Promises –
function searchkByISBN(ISBN) {
  return new Promise((resolve, reject) => {
    const book = books[ISBN];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("There is no book with such ISBN"));
    }
  });
}

public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  searchkByISBN(ISBN)
    .then((foundBook) => {
      res.send(foundBook);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});
// Task 12: Search by Author
function searchByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter((book) => {
      return book.author === author;
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error(`No books found for author ${author}.`));
    }
  });
}
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  searchByAuthor(author)
    .then((foundBooks) => {
      res.send(foundBooks);
    })
    .catch((error) => {
      res.send(error.message);
    });
});
// Task 13: Search by Title
function searchByTitle(title) {
  return new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter((book) => {
      return book.title === title;
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error(`No books found with title ${title}.`));
    }
  });
}

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  searchByTitle(title)
    .then((foundBooks) => {
      res.send(foundBooks);
    })
    .catch((error) => {
      res.send(error.message);
    });
});

module.exports.general = public_users;
