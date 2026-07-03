import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AviatorGame({ user, socket }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, crashed
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount, setBetAmount] = useState(100);
  const [hasPlaced, setHasPlaced] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [currentGame, setCurrentGame] = useState(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('bet-placed', handleBetPlaced);
      socket.on('crash', handleCrash);
      socket.on('cash-out', handleCashOut);

      return () => {
        socket.off('bet-placed');
        socket.off('crash');
        socket.off('cash-out');
      };
    }
  }, [socket]);

  useEffect(() => {
    drawGame();
  }, [multiplier, gameState]);

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw airplane
    drawAirplane(ctx, canvas);

    // Draw multiplier
    ctx.fillStyle = gameState === 'crashed' ? '#ef4444' : '#22c55e';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, 100);

    // Draw status
    ctx.fillStyle = '#d1d5db';
    ctx.font = '16px Arial';
    ctx.fillText(`Status: ${gameState.toUpperCase()}`, canvas.width / 2, canvas.height - 20);
  };

  const drawAirplane = (ctx, canvas) => {
    const x = (multiplier / 10) * canvas.width;
    const y = canvas.height * 0.3;

    // Draw airplane body
    ctx.fillStyle = gameState === 'crashed' ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y - 15);
    ctx.lineTo(x + 20, y + 15);
    ctx.closePath();
    ctx.fill();

    // Draw trail
    if (gameState === 'playing') {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 50, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handlePlaceBet = async () => {
    if (!currentGame) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/games/bet`, 
        {
          gameId: currentGame._id,
          betAmount: parseInt(betAmount)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasPlaced(true);
      setGameState('playing');
      startTimeRef.current = Date.now();
      animateGame();
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing bet');
    }
  };

  const animateGame = () => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newMultiplier = 1 + elapsed * 0.5;

    if (newMultiplier > 100) {
      setGameState('crashed');
      setMultiplier(100);
      return;
    }

    setMultiplier(newMultiplier);
    animationRef.current = requestAnimationFrame(animateGame);
  };

  const handleCashOut = () => {
    if (!hasPlaced || gameState !== 'playing') return;

    cancelAnimationFrame(animationRef.current);
    setGameState('cashed-out');
    setWinAmount(parseInt(betAmount) * multiplier);
    setHasPlaced(false);
  };

  const handleBetPlaced = (data) => {
    console.log('Bet placed:', data);
  };

  const handleCrash = (data) => {
    setGameState('crashed');
    setMultiplier(data.crashMultiplier);
  };

  const handleCashOutEvent = (data) => {
    console.log('Cash out:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">✈️ Aviator Game</h1>

        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full bg-gray-800 rounded-lg mb-6 border-2 border-purple-600"
        />

        {/* Betting Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Betting Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Place Bet</h2>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Bet Amount (৳)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={hasPlaced}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
                placeholder="100"
                min="10"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Quick Amounts</label>
              <div className="grid grid-cols-2 gap-2">
                {[100, 500, 1000, 5000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={hasPlaced}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg disabled:opacity-50"
                  >
                    ৳{amount}
                  </button>
                ))}
              </div>
            </div>

            {!hasPlaced ? (
              <button
                onClick={handlePlaceBet}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-bold"
              >
                Place Bet
              </button>
            ) : (
              <button
                onClick={handleCashOut}
                disabled={gameState !== 'playing'}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg font-bold disabled:opacity-50"
              >
                Cash Out @ {multiplier.toFixed(2)}x
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Game Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Current Multiplier</p>
                <p className="text-3xl font-bold text-purple-400">{multiplier.toFixed(2)}x</p>
              </div>
              <div>
                <p className="text-gray-400">Your Bet</p>
                <p className="text-2xl font-bold text-green-400">৳{betAmount}</p>
              </div>
              {hasPlaced && (
                <div>
                  <p className="text-gray-400">Potential Win</p>
                  <p className="text-2xl font-bold text-blue-400">৳{(parseInt(betAmount) * multiplier).toFixed(2)}</p>
                </div>
              )}
              {winAmount > 0 && (
                <div>
                  <p className="text-gray-400">You Won!</p>
                  <p className="text-2xl font-bold text-green-500">৳{winAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AviatorGame;
