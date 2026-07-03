import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phoneNumber: '',
    bkashNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">🎮 Create Account</h1>
        <p className="text-center text-gray-400 mb-8">Join our gaming platform</p>

        {error && <div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'email', type: 'email', placeholder: 'your@email.com', label: 'Email' },
            { name: 'username', type: 'text', placeholder: 'username', label: 'Username' },
            { name: 'password', type: 'password', placeholder: '••••••••', label: 'Password' },
            { name: 'phoneNumber', type: 'tel', placeholder: '01700000000', label: 'Phone Number' },
            { name: 'bkashNumber', type: 'tel', placeholder: '01700000000', label: 'BKash Number' }
          ].map(field => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder={field.placeholder}
                required={field.name !== 'phoneNumber' && field.name !== 'bkashNumber'}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
