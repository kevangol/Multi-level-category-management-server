const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

const protect = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.handler.unauthorized("Unauthorized access. Please log in to continue.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        return res.handler.unauthorized("Unauthorized access. Please log in to continue.");
    }
};

module.exports = protect