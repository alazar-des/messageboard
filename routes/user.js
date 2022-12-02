var express = require("express");
var router = express.Router();

const auth = require("../controller/auth");
//Get signup form
router.get("/signup", auth.checkLoggedIn, auth.signup_get);

//Post signup form
router.post("/signup", auth.checkLoggedIn, auth.signup_post);

//Get login form
router.get("/login", auth.checkLoggedIn, auth.login_get);

//Post login form
router.post("/login", auth.checkLoggedIn, auth.login_post);

//Get become a member form
router.get("/member", auth.checkAuthenticated, auth.member_form_get);

//Post become a member form
router.post("/member", auth.checkAuthenticated, auth.member_form_post);

router.get("/logout", auth.checkLoggedIn, auth.logout);

module.exports = router;
