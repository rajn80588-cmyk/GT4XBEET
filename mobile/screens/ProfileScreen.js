import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

function ProfileScreen() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {profile && (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{profile.username}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile.phoneNumber || 'Not set'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>{new Date(profile.createdAt).toLocaleDateString()}</Text>
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
  section: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 8
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ProfileScreen;
