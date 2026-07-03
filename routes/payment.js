const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
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

// Request Deposit
router.post('/deposit-request', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const transaction = new Transaction({
      userId: req.userId,
      type: 'deposit',
      amount,
      adminBkashNumber: process.env.BKASH_NUMBER,
      status: 'pending',
      description: 'Deposit request - Send money to admin BKash'
    });

    await transaction.save();

    res.status(201).json({
      message: 'Deposit request created',
      adminBkashNumber: process.env.BKASH_NUMBER,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating deposit request', error: error.message });
  }
});

// Request Withdrawal
router.post('/withdraw-request', verifyToken, async (req, res) => {
  try {
    const { amount, bkashNumber } = req.body;

    const user = await User.findById(req.userId);
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      userId: req.userId,
      type: 'withdraw',
      amount,
      bkashNumber,
      status: 'pending',
      description: 'Withdrawal request'
    });

    await transaction.save();

    res.status(201).json({
      message: 'Withdrawal request submitted',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating withdrawal request', error: error.message });
  }
});

// Get Transaction History
router.get('/history', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Confirm Deposit (Admin confirms deposit)
router.post('/confirm-deposit/:transactionId', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);

    if (!transaction || transaction.type !== 'deposit') {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    // Add balance to user
    const user = await User.findById(transaction.userId);
    user.balance += transaction.amount;
    user.totalDeposited += transaction.amount;
    await user.save();

    res.json({
      message: 'Deposit confirmed',
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming deposit', error: error.message });
  }
});

module.exports = router;
