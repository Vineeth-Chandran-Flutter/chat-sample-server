const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(400).json({ error: 'User registration failed' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
