const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { body, validationResult } = require("express-validator");

exports.signup_get = (req, res, next) => {
  res.render("signup_form", { title: "Signup" });
};

exports.signup_post = [
  body("username", "Username must be 5 chars long.")
    .trim()
    .isLength({ min: 5 })
    .custom((value) => {
      return User.find({ user_name: value }).then((user) => {
        if (user) {
          return Promise.reject("Username is already taken. Try another one");
        }
      });
    })
    .escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Must be at least 8 chars long.")
    .matches(/\d/)
    .withMessage("Must contain a number."),
  body("passwordconfrirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation doesn't match.");
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.render("signup_form", {
        user: {
          username: req.body.username,
          password: req.body.password,
          passwordconfirmation: req.body.passwordconfirmation,
        },
        errors,
      });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      else {
        const user = new User({
          user_name: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      }
    });
  },
];

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};

exports.login_post = [];

exports.member_form_get = (req, res, next) => {
  res.render("member_form", { title: "Become a Memeber" });
};

exports.member_form_post = [];