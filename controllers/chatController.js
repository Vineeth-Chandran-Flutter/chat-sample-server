const Chat = require('../models/Chat');

exports.saveMessage = async (roomId, userId, message) => {
  try {
    const chat = await Chat.findOne({ roomId });
    if (chat) {
      chat.messages.push({ sender: userId, message });
      await chat.save();
    } else {
      await Chat.create({ roomId, messages: [{ sender: userId, message }] });
    }
  } catch (err) {
    console.error('Error saving message:', err.message);
  }
};
