import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ user, socket }) {
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState(null);
  const [activeGames, setActiveGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [balanceRes, statsRes, gamesRes] = await Promise.all([
        axios.get(`${API_URL}/users/balance`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/games/active`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setBalance(balanceRes.data);
      setStats(statsRes.data);
      setActiveGames(gamesRes.data.games);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-purple-600 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-400">🎮 Gaming Platform</h1>
          <div className="flex gap-4">
            <Link to="/profile" className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">Profile</Link>
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg p-6 shadow-lg">
            <p className="text-gray-300 mb-2">Balance</p>
            <h2 className="text-3xl font-bold">৳ {balance.balance?.toFixed(2)}</h2>
            <p className="text-purple-300 text-sm mt-2">Deposited: ৳ {balance.totalDeposited?.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg p-6 shadow-lg">
            <p className="text-gray-300 mb-2">Total Bets</p>
            <h2 className="text-3xl font-bold">{balance.totalBets}</h2>
            <p className="text-blue-300 text-sm mt-2">Winnings: ৳ {balance.totalWinnings?.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-900 rounded-lg p-6 shadow-lg">
            <p className="text-gray-300 mb-2">Withdrawn</p>
            <h2 className="text-3xl font-bold">৳ {balance.totalWithdrawn?.toFixed(2)}</h2>
            <p className="text-green-300 text-sm mt-2">Total Transactions</p>
          </div>
        </div>

        {/* Active Games */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Active Games</h2>
          {activeGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGames.map(game => (
                <Link key={game._id} to={`/game`} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition cursor-pointer">
                  <p className="text-purple-400 font-bold">Game Type: {game.gameType.toUpperCase()}</p>
                  <p className="text-gray-300">Status: {game.status}</p>
                  <p className="text-gray-400 text-sm">Players: {game.players.length}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No active games at the moment</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/game" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg text-center font-bold">🎮 Play Game</Link>
          <Link to="/payment" className="bg-green-600 hover:bg-green-700 p-6 rounded-lg text-center font-bold">💰 Deposit/Withdraw</Link>
          <Link to="/profile" className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg text-center font-bold">👤 My Profile</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
