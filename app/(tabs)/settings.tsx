import React from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function settings() {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
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

