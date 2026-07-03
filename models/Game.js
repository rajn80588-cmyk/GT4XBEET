const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ['aviator', 'crash', 'dice', 'card', 'roulette'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'crashed', 'completed'],
    default: 'pending'
  },
  crashMultiplier: {
    type: Number,
    required: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: false
  },
  totalBets: {
    type: Number,
    default: 0
  },
  players: [{
    userId: mongoose.Schema.Types.ObjectId,
    betAmount: Number,
    cashOutMultiplier: Number,
    winAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'won', 'lost', 'cashout'],
      default: 'pending'
    }
  }],
  adminControlled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
