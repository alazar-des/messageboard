var express = require("express");
var router = express.Router();

const user_controller = require("../controller/userController");
//Get signup form
router.get("/signup", user_controller.signup_get);

//Post signup form
router.post("/signup", user_controller.signup_post);

//Get login form
router.get("/login", user_controller.login_get);

//Post login form
router.post("/login", user_controller.login_post);

//Get become a member form
router.get("/member", user_controller.member_form_get);

//Post become a member form
router.post("/member", user_controller.member_form_post);

module.exports = router;
