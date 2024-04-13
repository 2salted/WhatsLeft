import React from "react";
import { SafeAreaView, Text, StyleSheet, View, Button } from "react-native";
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
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </SafeAreaView>
  );
};

