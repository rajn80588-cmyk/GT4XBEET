import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

function DashboardScreen() {
  const [balance, setBalance] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Dashboard</Text>

      {balance && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Balance</Text>
            <Text style={styles.cardValue}>৳ {balance.balance?.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Bets</Text>
            <Text style={styles.cardValue}>{balance.totalBets}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Winnings</Text>
            <Text style={styles.cardValue}>৳ {balance.totalWinnings?.toFixed(2)}</Text>
          </View>
        </>
      )}
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
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#a855f7'
  },
  cardLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default DashboardScreen;
