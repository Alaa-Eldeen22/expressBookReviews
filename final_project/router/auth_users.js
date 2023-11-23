const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  const foundUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return foundUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "Customer loged in successfully" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/", (req, res) => {
  if (req.session.authorization) {
    const username = req.session.authorization.username;
    if (username) {
      const review = req.query.review;
      const ISBN = req.query.isbn;
      books[ISBN]["reviews"][username] = review;
      return res.status(200).json({
        message: `The review with ISBN ${ISBN} has been added/updated`,
      });
    } else {
      return res.status(400).json({ message: "Error adding/updating review" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});

// Deleting a book review
regd_users.delete("/auth/review/", (req, res) => {
  if (req.session.authorization) {
    const username = req.session.authorization.username;
    if (username) {
      const ISBN = req.query.isbn;
      books[ISBN]["reviews"][username] = {};
      return res.status(200).json({
        message: `The review with ISBN ${ISBN} has been deleted`,
      });
    } else {
      return res.status(400).json({ message: "Error deleting review" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});
module.exports.authenticated = regd_users;
module.exports.users = users;
