import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

function AviatorScreen() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState('waiting');
  const [betAmount, setBetAmount] = useState('100');
  const [hasPlaced, setHasPlaced] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const handlePlaceBet = () => {
    setHasPlaced(true);
    setGameState('playing');
    startTimeRef.current = Date.now();
    animateGame();
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
    animationRef.current = setTimeout(animateGame, 50);
  };

  const handleCashOut = () => {
    clearTimeout(animationRef.current);
    setGameState('cashed-out');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✈️ Aviator Game</Text>

      <View style={styles.gameBoard}>
        <Text style={[styles.multiplier, gameState === 'crashed' && styles.crashed]}>
          {multiplier.toFixed(2)}x
        </Text>
        <Text style={styles.status}>{gameState.toUpperCase()}</Text>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Bet Amount"
          placeholderTextColor="#9ca3af"
          value={betAmount}
          onChangeText={setBetAmount}
          editable={!hasPlaced}
          keyboardType="numeric"
        />

        {!hasPlaced ? (
          <TouchableOpacity style={styles.placeBetButton} onPress={handlePlaceBet}>
            <Text style={styles.buttonText}>Place Bet</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.cashOutButton, gameState !== 'playing' && styles.buttonDisabled]}
            onPress={handleCashOut}
            disabled={gameState !== 'playing'}
          >
            <Text style={styles.buttonText}>Cash Out @ {multiplier.toFixed(2)}x</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 20
  },
  gameBoard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#a855f7'
  },
  multiplier: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#22c55e'
  },
  crashed: {
    color: '#ef4444'
  },
  status: {
    color: '#9ca3af',
    marginTop: 10,
    fontSize: 14
  },
  controls: {
    marginTop: 20
  },
  input: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
    fontSize: 16
  },
  placeBetButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  cashOutButton: {
    backgroundColor: '#eab308',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default AviatorScreen;
