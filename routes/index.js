const express = require("express");
const authRoutes = require('./authRoutes.js');
const categoryRouter = require('./categoryRoutes.js');

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/category', categoryRouter);

module.exports = rootRouter
