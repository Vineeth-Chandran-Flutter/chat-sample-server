const express = require('express');
const { saveMessage } = require('../controllers/chatController.js');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// You can define chat routes here, protected by JWT authentication.
router.post('/send', protect, (req, res) => {
  const { roomId, message } = req.body;
  saveMessage(roomId, req.user._id, message);
  res.status(200).json({ success: true });
});

module.exports = router;
