import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Lightning CheckIn</Text>

      <TouchableOpacity
        onPress={() => alert('Hello, world!')}
        style={styles.mainButton}
      >
        <Text style={{ fontSize: 20, color: '#fff' }}>Log In with PCO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
});
