const express = require('express');
const Game = require('../models/Game');
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

// Get Active Games
router.get('/active', async (req, res) => {
  try {
    const games = await Game.find({ status: { $in: ['pending', 'running'] } });
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error: error.message });
  }
});

// Get Game History
router.get('/history', async (req, res) => {
  try {
    const games = await Game.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(50);
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game history', error: error.message });
  }
});

// Place Bet
router.post('/bet', verifyToken, async (req, res) => {
  try {
    const { gameId, betAmount } = req.body;

    const user = await User.findById(req.userId);
    if (user.balance < betAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const game = await Game.findById(gameId);
    if (!game || game.status !== 'running') {
      return res.status(400).json({ message: 'Game not available' });
    }

    // Deduct bet from user balance
    user.balance -= betAmount;
    user.totalBets += 1;
    await user.save();

    // Add player to game
    game.players.push({
      userId: req.userId,
      betAmount,
      status: 'pending'
    });
    game.totalBets += betAmount;
    await game.save();

    res.json({
      message: 'Bet placed successfully',
      game
    });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bet', error: error.message });
  }
});

// Cash Out
router.post('/cashout', verifyToken, async (req, res) => {
  try {
    const { gameId, multiplier } = req.body;

    const game = await Game.findById(gameId);
    const playerIndex = game.players.findIndex(p => p.userId.toString() === req.userId);

    if (playerIndex === -1) {
      return res.status(400).json({ message: 'You are not in this game' });
    }

    const player = game.players[playerIndex];
    const winAmount = player.betAmount * multiplier;

    // Update player status
    game.players[playerIndex].cashOutMultiplier = multiplier;
    game.players[playerIndex].winAmount = winAmount;
    game.players[playerIndex].status = 'cashout';
    await game.save();

    // Add winnings to user balance
    const user = await User.findById(req.userId);
    user.balance += winAmount;
    user.totalWinnings += winAmount;
    await user.save();

    res.json({
      message: 'Cash out successful',
      winAmount,
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during cashout', error: error.message });
  }
});

// Get User Game History
router.get('/user-history', verifyToken, async (req, res) => {
  try {
    const games = await Game.find({ 'players.userId': req.userId }).sort({ createdAt: -1 });
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user history', error: error.message });
  }
});

module.exports = router;
