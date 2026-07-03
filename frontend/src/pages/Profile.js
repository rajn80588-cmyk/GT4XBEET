import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [bkashNumber, setBkashNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const [profileRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setProfile(profileRes.data.user);
      setStats(statsRes.data);
      setBkashNumber(profileRes.data.user.bkashNumber || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleUpdateBkash = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/update-bkash`, 
        { bkashNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('BKash number updated successfully');
      fetchProfile();
    } catch (error) {
      alert('Error updating BKash number');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">← Back</button>

        <h1 className="text-3xl font-bold text-purple-400 mb-6">👤 My Profile</h1>

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Username</p>
                  <p className="text-xl font-bold">{profile.username}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-xl">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-xl">{profile.phoneNumber || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Member Since</p>
                  <p className="text-xl">{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Total Bets</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalBets}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Winnings</p>
                  <p className="text-2xl font-bold text-green-400">৳{stats.totalWinnings?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Average Win</p>
                  <p className="text-2xl font-bold text-blue-400">৳{stats.averageWin}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BKash Settings */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">💰 BKash Settings</h2>
          <div className="space-y-4">
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
            <button
              onClick={handleUpdateBkash}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update BKash Number'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
