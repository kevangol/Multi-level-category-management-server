const express = require('express');
const { signup, signin, logout } = require('../controllers/AuthController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/register', signup);
router.post('/signin', signin);
router.post('/logout', logout);


module.exports = router
