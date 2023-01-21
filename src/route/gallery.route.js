const express = require("express");
const router = express.Router();
const GalleryController = require("../controller/gallery.controller");
const validation = require("../middleware/validate.middleware");

router.post("/create", GalleryController.create);
router.post("/read", GalleryController.read);
router.post("/readAll", GalleryController.readAll);
router.post("/update", GalleryController.update);
router.post("/remove", GalleryController.remove);

module.exports = router;