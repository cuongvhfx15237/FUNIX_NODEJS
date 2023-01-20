const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: '',
      passsword: '',
    },
    validationErrors: [],
  });
};


exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput : {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    })
  }
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: 'Login',
        errorMessage: "Invalid email or Password!",
        oldInput : {
          email : email,
          password: password
        },
        validationErrors: [],
      })
    }
    else if (password === user.password) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        res.redirect("/");
      });
    }
  
    else {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or Password.",
        oldInput : {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    } 
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
  }

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
