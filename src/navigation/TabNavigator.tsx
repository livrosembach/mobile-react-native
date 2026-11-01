import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { Compass, Search, Heart, BookOpen } from 'lucide-react-native';
import { TabParamList } from '../types/navigation';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { MyBooksScreen } from '../screens/MyBooksScreen';
import { Colors, Typography } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

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
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = size ?? 22;
          switch (route.name) {
            case 'Discover':
              return <Compass size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
            case 'Search':
              return <Search size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
            case 'Favorites':
              return (
                <Heart
                  size={iconSize}
                  color={color}
                  fill={focused ? color : 'transparent'}
                  strokeWidth={focused ? 2.5 : 2}
                />
              );
            case 'MyBooks':
              return <BookOpen size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />;
            default:
              return null;
          }
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
