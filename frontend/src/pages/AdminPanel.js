import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminPanel.css';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [games, setGames] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [crashMultiplier, setCrashMultiplier] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (activeTab === 'dashboard') {
        const res = await axios.get(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboard(res.data);
      } else if (activeTab === 'users') {
        const res = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.users);
      } else if (activeTab === 'transactions') {
        const res = await axios.get(`${API_URL}/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data.transactions);
      } else if (activeTab === 'games') {
        const res = await axios.get(`${API_URL}/games/active`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGames(res.data.games);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleControlGame = async () => {
    if (!selectedGameId || !crashMultiplier) {
      alert('Please select game and enter multiplier');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/admin/control-game`,
        {
          gameId: selectedGameId,
          crashMultiplier: parseFloat(crashMultiplier),
          status: 'crashed'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Game controlled successfully');
      fetchData();
    } catch (error) {
      alert('Error controlling game');
    }
  };

  const handleApproveTransaction = async (transactionId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/admin/transaction/${transactionId}`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Transaction approved');
      fetchData();
    } catch (error) {
      alert('Error approving transaction');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🔧 Admin Control Panel</h1>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>Logout</button>
      </div>

      <div className="admin-tabs">
        {['dashboard', 'users', 'transactions', 'games'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); setLoading(true); }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === 'dashboard' && dashboard && (
              <div className="dashboard-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-value">{dashboard.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Games</h3>
                  <p className="stat-value">{dashboard.totalGames}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Deposits</h3>
                  <p className="stat-value">৳{dashboard.totalDeposits.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Withdrawals</h3>
                  <p className="stat-value">৳{dashboard.totalWithdrawals.toFixed(2)}</p>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Balance</th>
                      <th>Total Bets</th>
                      <th>Total Winnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>৳{user.balance.toFixed(2)}</td>
                        <td>{user.totalBets}</td>
                        <td>৳{user.totalWinnings.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx._id}>
                        <td>{tx.userId.username}</td>
                        <td>{tx.type}</td>
                        <td>৳{tx.amount}</td>
                        <td>
                          <span className={`status ${tx.status}`}>{tx.status}</span>
                        </td>
                        <td>
                          {tx.status === 'pending' && (
                            <button
                              className="approve-btn"
                              onClick={() => handleApproveTransaction(tx._id)}
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'games' && (
              <>
                <div className="game-control">
                  <h3>Control Game Results</h3>
                  <div className="control-form">
                    <select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)}>
                      <option value="">Select Game</option>
                      {games.map(game => (
                        <option key={game._id} value={game._id}>
                          {game.gameType} - {game.status}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Crash Multiplier"
                      value={crashMultiplier}
                      onChange={(e) => setCrashMultiplier(e.target.value)}
                      step="0.1"
                      min="1"
                    />
                    <button onClick={handleControlGame}>Control Game</button>
                  </div>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Game Type</th>
                        <th>Status</th>
                        <th>Players</th>
                        <th>Total Bets</th>
                        <th>Crash Multiplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map(game => (
                        <tr key={game._id}>
                          <td>{game.gameType}</td>
                          <td>{game.status}</td>
                          <td>{game.players.length}</td>
                          <td>৳{game.totalBets}</td>
                          <td>{game.crashMultiplier ? game.crashMultiplier.toFixed(2) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
