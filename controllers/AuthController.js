const generateToken = require('../utils/generateToken.js');
const { registerUser, loginUser } = require('../services/AuthService.js');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser(name, email, password);
        generateToken(res, user._id);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        generateToken(res, user._id);
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    signup, signin, logout
}