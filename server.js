const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/games', require('./routes/games'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/users', require('./routes/users'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Socket.IO - Real-time Game Events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Join game room
  socket.on('join-game', (gameId) => {
    socket.join(`game-${gameId}`);
    io.to(`game-${gameId}`).emit('player-joined', {
      playerId: socket.id,
      timestamp: new Date()
    });
  });

  // Place bet
  socket.on('place-bet', (data) => {
    io.to(`game-${data.gameId}`).emit('bet-placed', {
      playerId: socket.id,
      amount: data.amount,
      multiplier: data.multiplier
    });
  });

  // Cash out
  socket.on('cash-out', (data) => {
    io.to(`game-${data.gameId}`).emit('cash-out', {
      playerId: socket.id,
      winAmount: data.winAmount
    });
  });

  // Game crash
  socket.on('game-crash', (data) => {
    io.to(`game-${data.gameId}`).emit('crash', {
      crashMultiplier: data.crashMultiplier,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🎮 Gaming Platform Server running on port ${PORT}`);
});

module.exports = { app, io };
