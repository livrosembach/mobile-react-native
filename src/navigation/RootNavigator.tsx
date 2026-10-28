import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { BookDetailsScreen } from '../screens/BookDetailsScreen';
import { Colors } from '../theme';

const RootStack = createNativeStackNavigator<RootStackParamList & { Auth: undefined }>();

export function RootNavigator() {
  const { user, loading } = useAuth();

  // Show a loading screen while Firebase restores the session
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.terracotta} />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <RootStack.Screen name="Tabs" component={TabNavigator} />
          <RootStack.Screen
            name="BookDetails"
            component={BookDetailsScreen}
            options={{
              headerShown: true,
              title: '',
              headerBackTitle: 'Back',
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.terracotta,
              headerTitleStyle: {
                color: Colors.ink,
                fontSize: 16,
                fontWeight: '600',
              },
            }}
          />
        </>
      ) : (
        <RootStack.Screen name={'Auth' as any} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
