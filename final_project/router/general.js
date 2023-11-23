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
    res.send("There is no book with such ISBN");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author === author;
  });
  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => {
    return book.title === title;
  });
  res.send(booksByTitle);
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

module.exports.general = public_users;
