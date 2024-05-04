const User = require("../models/userModel");

// Register
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.register(email, password, name);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { registerUser, loginUser };
