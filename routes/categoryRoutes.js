const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController.js");

router.post("/category", categoryController.createCategory);
router.get("/category", categoryController.getCategoriesTree);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;