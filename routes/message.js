var express = require("express");
var router = express.Router();

const auth = require("../controller/auth");

const message_controller = require("../controller/messageController");

router.get("/", message_controller.messages);

router.get("/create", auth.checkAuthenticated, message_controller.message_get);

router.post("/create", auth.checkAuthenticated, message_controller.message_post);

//delete post
router.get("/:message_id/delete", auth.checkAuthenticated, auth.canDelete("admin"), message_controller.message_delete)
module.exports = router;
