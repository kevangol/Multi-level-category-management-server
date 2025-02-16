const express = require("express");
const authRoutes = require('./authRoutes.js');
const protect = require("../middlewares/authMiddleware.js");
const categoryController = require("../controllers/CategoryController.js");
const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);

rootRouter.use(protect);
rootRouter.post("/category", categoryController.createCategory);
rootRouter.get("/category", categoryController.getCategoriesTree);
rootRouter.put("/category/:id", categoryController.updateCategory);
rootRouter.delete("/category/:id", categoryController.deleteCategory);


module.exports = rootRouter
