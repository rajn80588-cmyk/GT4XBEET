import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

function PaymentScreen() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/payment/deposit-request`,
        { amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Deposit Request', `Send ৳${amount} to: ${response.data.adminBkashNumber}`);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error creating deposit request');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !bkashNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/payment/withdraw-request`,
        { amount: parseInt(amount), bkashNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Withdrawal request submitted');
      setAmount('');
      setBkashNumber('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error creating withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'deposit' && styles.activeTab]}
          onPress={() => setActiveTab('deposit')}
        >
          <Text style={[styles.tabText, activeTab === 'deposit' && styles.activeTabText]}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'withdraw' && styles.activeTab]}
          onPress={() => setActiveTab('withdraw')}
        >
          <Text style={[styles.tabText, activeTab === 'withdraw' && styles.activeTabText]}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount (৳)"
          placeholderTextColor="#9ca3af"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          editable={!loading}
        />

        {activeTab === 'withdraw' && (
          <TextInput
            style={styles.input}
            placeholder="BKash Number"
            placeholderTextColor="#9ca3af"
            value={bkashNumber}
            onChangeText={setBkashNumber}
            editable={!loading}
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 24
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#374151'
  },
  activeTab: {
    borderBottomColor: '#a855f7'
  },
  tabText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  activeTabText: {
    color: '#a855f7'
  },
  form: {
    gap: 12
  },
  input: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#a855f7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default PaymentScreen;
