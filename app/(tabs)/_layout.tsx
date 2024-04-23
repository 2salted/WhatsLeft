import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

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
          title: 'index',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="comments" color={color} />,
          headerLeft: () => (
            <Pressable>
              {({ pressed }) => (
                <FontAwesome name='ellipsis-h' size={30} style={{
                  color: 'white', marginLeft: 20, opacity: pressed ? 0.4 : 1
                }} />
              )}
            </Pressable>
          ),
          headerRight: () => (
            <Link href="/addUserModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome name='plus-circle' size={30} style={{
                    color: 'white', marginRight: 20, opacity: pressed ? 0.4 : 1
                  }} />
                )}
              </Pressable>
            </Link>
          )
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

