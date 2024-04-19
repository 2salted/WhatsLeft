import React, { useEffect } from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function settings() {
  const { isLoaded, userId, sessionId, signOut } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !userId) {
    return null;
  }

  const checkClerkIdExists = async (clerkId: string) => {
    try {
      const response = await fetch(`http://192.168.0.148:3000/${clerkId}`);
      if (!response.ok) {
        throw new Error('Failed to check clerk ID');
      }
      const data = await response.json();
      console.log('Clerk ID exists:', data.exists);
      if (!data.exists && sessionId) {
        console.log('Clerk ID exists:', data.exists);
        fetch('http://192.168.0.148:3000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: user?.firstName,
            lastName: user?.lastName,
            clerkId: userId,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    checkClerkIdExists(userId)
  }, []);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: 'black'
    }}>
      <Text className='text-gray-50 text-4xl font-bold px-5'>Settings</Text>
      <View className="items-center py-5">
        <Pressable
          onPress={() => {
            signOut();
          }}>
          <Text className="text-white">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

