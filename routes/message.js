var express = require("express");
var router = express.Router();

const message_controller = require("../controller/messageController");

router.get("/", message_controller.messages);

router.get("/create", message_controller.message_get);

router.post("/create", message_controller.message_post);

module.exports = router;
