const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/category.controller");
const validation = require("../middleware/validate.middleware");

router.post("/create", CategoryController.create);
router.post("/read", CategoryController.read);
router.post("/readAll", CategoryController.readAll);
router.post("/update", CategoryController.update);
router.post("/remove", CategoryController.remove);

module.exports = router;