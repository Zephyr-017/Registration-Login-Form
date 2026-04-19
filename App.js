import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screen yang sudah dibuat sebelumnya
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

// Inisialisasi Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Layar Login - Kita sembunyikan headernya agar tampilannya lebih clean */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Layar Register - Kita berikan judul header bawaan */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Registrasi Akun',
            headerBackTitle: 'Kembali' // Opsional untuk iOS
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}