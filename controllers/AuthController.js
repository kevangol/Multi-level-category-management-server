const generateToken = require('../utils/generateToken.js');
const { registerUser, loginUser, getUserById } = require('../services/AuthService.js');

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
        return res.handler.success(user, "Login successfully")
    } catch (error) {
        return res.handler.serverError(error.message)
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        if (!user) {
            return res.handler.notFound("User not found");
        }
        return res.handler.success(user, "Profile fetched successfully");
    } catch (error) {
        return res.handler.serverError(error.message);
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    return res.handler.success("Logout successfully")
};

module.exports = {
    signup, signin, logout, getProfile
}