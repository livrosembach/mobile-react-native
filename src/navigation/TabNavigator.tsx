import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, Platform } from 'react-native';
import { TabParamList } from '../types/navigation';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { MyBooksScreen } from '../screens/MyBooksScreen';
import { Colors, Typography } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, { active: string; inactive: string }> = {
  Discover: { active: '⬡', inactive: '⬡' },
  Search: { active: '◎', inactive: '○' },
  Favorites: { active: '♥', inactive: '♡' },
  MyBooks: { active: '▣', inactive: '▢' },
};

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Discover: 'Discover',
  Search: 'Search',
  Favorites: 'Favourites',
  MyBooks: 'My Books',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <Text style={{ color, fontSize: 20 }}>
              {focused ? icons.active : icons.inactive}
            </Text>
          );
        },
        tabBarLabel: TAB_LABELS[route.name],
        tabBarActiveTintColor: Colors.terracotta,
        tabBarInactiveTintColor: Colors.inkSubtle,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 4,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        },
        tabBarLabelStyle: {
          ...Typography.tiny,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ tabBarAccessibilityLabel: 'Discover new books' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarAccessibilityLabel: 'Search books' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarAccessibilityLabel: 'Your favourite books' }}
      />
      <Tab.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{ tabBarAccessibilityLabel: 'Your reading library' }}
      />
    </Tab.Navigator>
  );
}
