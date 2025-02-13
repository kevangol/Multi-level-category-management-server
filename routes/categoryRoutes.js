const express = require('express');

const categoryRouter = express.Router();

categoryRouter.post('/signup', signup);
categoryRouter.post('/signin', signin);
categoryRouter.post('/logout', logout);
categoryRouter.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

module.exports = categoryRouter;