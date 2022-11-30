const User = require("../models/user");

const { body, validationResult } = require("express-validator");

exports.messages = (req, res, next) => {
  res.render("index", { title: "Messages" });
};

exports.message_get = (req, res, next) => {
  res.render("message_form", { title: "Create message" });
};

exports.message_post = [];
