const User = require('../models/User.model.js');

const registerUser = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const newUser = new User({ name, email, password });
    await newUser.save();
    return newUser;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
    }
    return user;
};

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password'); // Excluding password for security
    if (!user) throw new Error('User not found');
    return user;
};

module.exports = {
    registerUser, loginUser, getUserById
}