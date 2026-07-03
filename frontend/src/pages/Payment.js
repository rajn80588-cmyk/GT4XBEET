import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Payment({ user }) {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/payment/history`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/payment/deposit-request`,
        { amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Send ৳${amount} to: ${response.data.adminBkashNumber}`);
      setAmount('');
      fetchTransactions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating deposit request');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !bkashNumber) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/payment/withdraw-request`,
        { amount: parseInt(amount), bkashNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Withdrawal request submitted. Admin will approve soon.');
      setAmount('');
      setBkashNumber('');
      fetchTransactions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">💰 Payments</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'deposit'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'withdraw'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deposit/Withdraw Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {activeTab === 'deposit' ? '💳 Deposit Money' : '💸 Withdraw Money'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Amount (৳)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
                  placeholder="Enter amount"
                  min="100"
                />
              </div>

              {activeTab === 'withdraw' && (
                <div>
                  <label className="block text-gray-300 mb-2">BKash Number</label>
                  <input
                    type="tel"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
                    placeholder="01700000000"
                  />
                </div>
              )}

              <button
                onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg font-bold text-white disabled:opacity-50 ${
                  activeTab === 'deposit'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">📜 Recent Transactions</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.slice(0, 10).map(tx => (
                  <div key={tx._id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-bold capitalize">{tx.type}</span>
                      <span className={`font-bold ${
                        tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        ৳{tx.amount}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Status: {tx.status}</p>
                    <p className="text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
