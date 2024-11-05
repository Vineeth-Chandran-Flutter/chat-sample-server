const express = require('express');
const http = require('http');
 const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
 const { connectDB } = require('./config/db.js');
const chatRoutes = require('./routes/chatRoute.js');
const userRoutes = require('./routes/userRoute.js');
const { authenticateSocket } = require('./middlewares/authMiddleware.js');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// MongoDB Connection
connectDB();

// Socket.IO Authentication middleware
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('sendMessage', async ({ roomId, message, userId }) => {
    io.to(roomId).emit('receiveMessage', { message, userId });
    // Save message to MongoDB (You can handle this in controller)
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
