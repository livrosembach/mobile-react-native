import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { LibraryProvider } from './src/contexts/LibraryContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/theme';

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </LibraryProvider>
    </AuthProvider>
  );
}
