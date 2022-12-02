const User = require("../models/user");
const Message = require("../models/message");
const auth = require("./auth");

const { body, validationResult } = require("express-validator");
const { connect } = require("mongoose");
const message = require("../models/message");

exports.messages = (req, res, next) => {
  Message.find({})
    .sort({ date: -1 })
    .populate("user")
    .exec((err, messages) => {
      console.log(messages);
      if (err) return next(err);
      console.log(messages);
      res.render("index", {
        title: "Messages",
        messages,
      });
    });
};

exports.message_get = (req, res, next) => {
  if (req?.user) res.render("message_form", { title: "Create message" });
  else res.redirect("/users/login");
};

exports.message_post = [
  body("title", "title should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("message", "message should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "Create Message",
        message: {
          title: req.body.title,
          msg: req.body.message,
        },
        errors: errors.array(),
      });
      return;
    }
    const msg = new Message({
      title: req.body.title,
      body: req.body.message,
      user: req.user,
    }).save((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
];
