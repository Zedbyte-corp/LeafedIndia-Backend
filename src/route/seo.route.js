const express = require("express");
const router = express.Router();
const SeoController = require("../controller/seo.controller");
const validation = require("../middleware/validate.middleware");

router.post("/create", SeoController.create);
router.post("/read", SeoController.read);
router.post("/readAll", SeoController.readAll);
router.post("/update", SeoController.update);
router.post("/remove", SeoController.remove);

module.exports = router;