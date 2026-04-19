import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue != null) {
          setUserData(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log('Error fetching user data', e);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // You can keep the user data for next login or remove it, usually we just remove the session token
      // Currently, since we only mocked login, we just navigate back to Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.log('Error logging out', e);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hapus Akun",
      "Apakah Anda yakin ingin menghapus akun Anda?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Hapus",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userData');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              console.log('Error deleting user data', e);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>
      
      {userData ? (
        <View style={styles.profileCard}>
          {userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.avatar} />
          ) : (
             <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.info}>{userData.email}</Text>
          <Text style={styles.info}>{userData.phone}</Text>
        </View>
      ) : (
        <Text style={styles.subText}>Memuat data pengguna...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Hapus Akun</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#007BFF',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#a71d2a',
    marginTop: 12,
  },
});
