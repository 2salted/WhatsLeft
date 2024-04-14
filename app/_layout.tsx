import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Stack } from 'expo-router/stack';
const clerkApiKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import React from "react";
import SignUpScreen from '@/components/SignUpScreen';
import SignInScreen from '../components/SignInScreen';
import * as SecureStore from "expo-secure-store";

export default function AppLayout() {
  const [test, setTest] = React.useState(false);

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
        {
          test === false ?
            <SignUpScreen setTest={setTest} />
            : <SignInScreen setTest={setTest} />
        }
      </SignedOut>
    </ClerkProvider>
  );
}
