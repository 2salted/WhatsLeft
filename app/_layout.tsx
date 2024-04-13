import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Stack } from 'expo-router/stack';
import { SafeAreaView, Text } from 'react-native';
const clerkApiKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import React from "react";
import SignUpScreen from '@/components/SignUpScreen';
import SignInScreen from '@/components/SignInScreen';
import * as SecureStore from "expo-secure-store";
import { Link } from 'expo-router';

export default function AppLayout() {

  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkApiKey!}>
      <SignedIn>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SignedIn>
      <SignedOut>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
          <SignUpScreen />
        </SafeAreaView>
      </SignedOut>
    </ClerkProvider>
  );
}
