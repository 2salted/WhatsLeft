import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Stack } from 'expo-router/stack';
import { SafeAreaView } from 'react-native';
const clerkApiKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import React from "react";
import SignUpScreen from '@/components/SignUpScreen';
import SignInScreen from '@/components/SignInScreen';

export default function AppLayout() {
  return (
    <ClerkProvider publishableKey={clerkApiKey!}>
      <SignedIn>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SignedIn>
      <SignedOut>
        <SafeAreaView>
          <SignInScreen />
        </SafeAreaView>
      </SignedOut>
    </ClerkProvider>
  );
}
