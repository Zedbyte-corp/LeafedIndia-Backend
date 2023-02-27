const express = require("express");
const router = express.Router();
const MailController = require("../controller/mail.controller");
const validation = require("../middleware/validate.middleware");

router.post("/send", MailController.send);
router.post("/sendWithImage", MailController.sendWithImage);

module.exports = router;