const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token failed' });
  }
};

exports.authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Not authorized'));
  }
  try {
    const decoded = verifyToken(token);
    socket.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
};
