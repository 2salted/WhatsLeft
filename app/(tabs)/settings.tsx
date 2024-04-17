import React from "react";
import { SafeAreaView, Text, StyleSheet, View, Button, Pressable } from "react-native";
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
      <Pressable
        onPress={() => {
          signOut();
        }}>
        <Text className="text-white">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

