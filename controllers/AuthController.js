const generateToken = require('../utils/generateToken.js');
const { registerUser, loginUser } = require('../services/AuthService.js');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser(name, email, password);
        generateToken(res, user._id);
        return res.handler.success("User registered successfully")
    } catch (error) {
        return res.handler.serverError();
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        generateToken(res, user._id);
        return res.handler.success("Login successfully", user)
    } catch (error) {
        return res.handler.serverError()
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    return res.handler.success("Logout successfully")
};

module.exports = {
    signup, signin, logout
}