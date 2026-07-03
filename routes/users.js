const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update BKash Number
router.put('/update-bkash', verifyToken, async (req, res) => {
  try {
    const { bkashNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { bkashNumber },
      { new: true }
    ).select('-password');

    res.json({
      message: 'BKash number updated',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating BKash number', error: error.message });
  }
});

// Get User Balance
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      balance: user.balance,
      totalDeposited: user.totalDeposited,
      totalWithdrawn: user.totalWithdrawn,
      totalBets: user.totalBets,
      totalWinnings: user.totalWinnings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance', error: error.message });
  }
});

// Get User Statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const stats = {
      username: user.username,
      email: user.email,
      balance: user.balance,
      totalBets: user.totalBets,
      totalWinnings: user.totalWinnings,
      averageWin: user.totalBets > 0 ? (user.totalWinnings / user.totalBets).toFixed(2) : 0,
      totalDeposited: user.totalDeposited,
      totalWithdrawn: user.totalWithdrawn,
      memberSince: user.createdAt
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
