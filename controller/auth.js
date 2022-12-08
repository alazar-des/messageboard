const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { body, validationResult } = require("express-validator");

const authUser = (username, password, done) => {
  User.findOne({ user_name: username }, (err, user) => {
    if (err) return done(err);
    if (!user)
      return done(null, false, {
        message: "Unable to login. Incorrect username or password",
      });
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) return done(null, user);
      else
        return done(null, false, {
          message: "Incorrect username or password",
        });
    });
  });
};

passport.use(new LocalStrategy(authUser));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/users/login");
};

exports.checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};

exports.canDelete = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.render("error", {
        message: "Not allowed",
        error: {
          status: 401,
          stack: "not allowed",
        },
      });
    }
    next();
  };
};

exports.signup_get = (req, res, next) => {
  res.render("signup_form", { title: "Signup" });
};

exports.signup_post = [
  body("username", "Username must be atleast 5 chars long.")
    .trim()
    .isLength({ min: 5 })
    .custom((value) => {
      return User.find({ user_name: value }).then((user) => {
        if (user.length !== 0) {
          return Promise.reject("Username is already taken. Try another one");
        }
      });
    })
    .escape(),
  body("password", "Password must be atleast 8 chars long.").isLength({
    min: 8,
  }),
  body("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation doesn't match.");
    } else {
      return true;
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signup_form", {
        title: "Sign up",
        user: {
          username: req.body.username,
          password: req.body.password,
          confirmpassword: req.body.confirmpassword,
        },
        errors: errors.array(),
      });
      return;
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      else {
        const user = new User({
          user_name: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) return next(err);
          res.redirect("/users/login");
        });
      }
    });
  },
];

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureMessage: true,
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.member_form_get = (req, res, next) => {
  res.render("member_form", { title: "Become a Memeber" });
};

exports.member_form_post = [
  body("code", "member code must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .custom((value) => {
      if (value !== process.env.MEMBER_SECRET_CODE) {
        throw new Error("Wrong secret code. Try agian.");
      } else {
        return true;
      }
    })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("member_form", {
        title: "Become a Memeber",
        errors: errors.array(),
      });
      return;
    }
    User.findByIdAndUpdate(
      req.user,
      { membership_status: true },
      (err, user) => {
        if (err) return next(err);
        res.redirect("/");
      }
    );
  },
];
