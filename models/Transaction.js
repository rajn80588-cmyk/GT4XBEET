const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'bet', 'win', 'loss'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bkashNumber: {
    type: String,
    required: false
  },
  adminBkashNumber: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: false
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
