const express = require("express");
const router = express.Router();
const ProductController = require("../controller/product.controller");
const validation = require("../middleware/validate.middleware");

router.post("/create", ProductController.create);
router.post("/read", ProductController.read);
router.post("/readAll", ProductController.readAll);
router.post("/update", ProductController.update);
router.post("/remove", ProductController.remove);
router.post("/readCategory", ProductController.readCategory);

module.exports = router;