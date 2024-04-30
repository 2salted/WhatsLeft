"use strict";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";

type User = {
  firstName: string;
  lastName: string;
  clerkId: string;
};

export default function Tab() {
  const { isLoaded, userId, sessionId } = useAuth();
  const [convoSearch, setConvoSearch] = useState<string>("");
  const [messages, setMessages] = useState<User[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const { user } = useUser();

  if (!isLoaded || !userId) {
    return null;
  }

  const checkClerkIdExists = async (clerkId: string) => {
    try {
      const response = await fetch(`http://192.168.0.148:3000/${clerkId}`);
      if (!response.ok) {
        throw new Error("Failed to check clerk ID");
      }
      const data = await response.json();
      console.log("Clerk ID exists:", data.exists);
      if (!data.exists && sessionId) {
        console.log("Clerk ID exists:", data.exists);
        fetch("http://192.168.0.148:3000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: user?.firstName,
            lastName: user?.lastName,
            clerkId: userId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function checkPersonalMessages(userIdEndPoint: string[]) {
    try {
      setShowSpinner(true);
      const response = await fetch(
        "http://192.168.0.148:3000/personalMessages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIdEndPoint }),
        },
      );
      const data: User[] =
        await response.json();
      setMessages(data.filter((item) => item.clerkId !== userId));
      setShowSpinner(false);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return { error: "Failed to fetch data" };
    }
  }

  useEffect(() => {
    checkClerkIdExists(userId);
    checkPersonalMessages([userId]);
  }, [convoSearch]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <ScrollView>
        <Text className="text-gray-50 text-4xl font-bold px-5">Chats</Text>
        <View className="px-4 pb-3 pt-3">
          <TextInput
            className="bg-zinc-800 px-2 py-2 text-base rounded-xl
            leading-5 text-white"
            placeholder="Search..."
            value={convoSearch}
            placeholderTextColor="#8e8e8e"
            onChangeText={(searchConvo) => setConvoSearch(searchConvo)}
          />
          <View className="pt-6">
            {showSpinner ? (
              <View className="items-center justify-center h-full">
                <ActivityIndicator size="large" />
              </View>
            ) : messages.length > 0 ? (
              messages.map((convo, index) => {
                return (
                  <View key={index} className="flex-row py-2 border border-white">
                    <View className="">
                      <Image source={require("../../assets/images/defaultImage.png")}
                        className="rounded-full h-14 w-14"
                      />
                    </View>
                    <View className="px-3">
                      <View>
                        <Text className="text-white capitalize font-bold text-base">
                          {convo.firstName + " " + convo.lastName}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-white">Hello</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="items-center justify-center pt-20">
                <Text className="text-gray-50 font-bold text-xl">
                  No Messages
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
