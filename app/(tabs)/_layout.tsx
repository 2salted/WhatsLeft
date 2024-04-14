import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerTitleStyle: { color: 'white' },
      headerTitle: '',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: 'black',
      },
      tabBarActiveTintColor: 'white',
      tabBarStyle: {
        borderTopWidth: 0,
        backgroundColor: 'black'
      }
    }}>
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="phone" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}

