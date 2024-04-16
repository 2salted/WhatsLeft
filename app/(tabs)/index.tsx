import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Text, SafeAreaView, ScrollView } from 'react-native';

export default function Tab() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  if (!isLoaded || !userId) {
    return null;
  }
  const sendDataToBackend = () => {
    fetch('http://192.168.0.148:3000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        clerkId: '12345',
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // useEffect hook to execute sendDataToBackend when component mounts
  useEffect(() => {
    sendDataToBackend();
  }, []); // empty dependency array ensures that it only runs once on mount

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <ScrollView>
        <Text className='text-gray-50 text-4xl font-bold px-5'>Chats</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
