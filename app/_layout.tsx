"use strict";

import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router/stack";
const clerkApiKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import React from "react";
import SignUpScreen from "@/components/SignUpScreen";
import SignInScreen from "../components/SignInScreen";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import 'react-native-reanimated';

export default function AppLayout(): React.JSX.Element {
  const [test, setTest] = React.useState<boolean>(false);

  const tokenCache = {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return await SecureStore.setItemAsync(key, value);
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
          <Stack.Screen
            name="addUserModal"
            options={{
              presentation: "modal",
              headerTitle: "New Message",
              headerTitleStyle: { color: "white" },
              headerShadowVisible: false,
              headerLeft: () => <View></View>,
              headerRight: () => (
                <View>
                  <Link href="/">
                    <FontAwesome
                      name="close"
                      size={20}
                      style={{ color: "white" }}
                    />
                  </Link>
                </View>
              ),
              headerStyle: {
                backgroundColor: "#1e1e1e",
              },
            }}
          />
        </Stack>
      </SignedIn>
      <SignedOut>
        {test === false ? (
          <SignUpScreen setTest={setTest} />
        ) : (
          <SignInScreen setTest={setTest} />
        )}
      </SignedOut>
    </ClerkProvider>
  );
}
