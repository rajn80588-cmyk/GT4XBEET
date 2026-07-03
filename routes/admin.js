const express = require('express');
const User = require('../models/User');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to check admin
const checkAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get All Users
router.get('/users', checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get User Details
router.get('/users/:userId', checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Control Aviator Game (Set Crash Multiplier)
router.post('/control-game', checkAdmin, async (req, res) => {
  try {
    const { gameId, crashMultiplier, status } = req.body;

    const game = await Game.findByIdAndUpdate(
      gameId,
      { crashMultiplier, status },
      { new: true }
    );

    res.json({
      message: 'Game controlled successfully',
      game
    });
  } catch (error) {
    res.status(500).json({ message: 'Error controlling game', error: error.message });
  }
});

// Create New Game
router.post('/create-game', checkAdmin, async (req, res) => {
  try {
    const { gameType } = req.body;

    const game = new Game({
      gameType,
      adminControlled: true
    });

    await game.save();

    res.status(201).json({
      message: 'Game created successfully',
      game
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating game', error: error.message });
  }
});

// Approve/Reject Withdrawal
router.post('/transaction/:transactionId', checkAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = status;
    transaction.completedAt = new Date();
    await transaction.save();

    res.json({
      message: 'Transaction updated',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
});

// Get All Transactions
router.get('/transactions', checkAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'username email bkashNumber');
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Admin Dashboard Stats
router.get('/dashboard', checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGames = await Game.countDocuments();
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: 'withdraw', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalGames,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalWithdrawals: totalWithdrawals[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
});

module.exports = router;
