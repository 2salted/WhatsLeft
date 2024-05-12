"use strict";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  FlatList,
  Pressable,
} from "react-native";

type User = {
  firstName: string;
  lastName: string;
  clerkId: string;
  pfp: string;
};

export default function Tab(): React.JSX.Element {
  const { isLoaded, userId, sessionId } = useAuth();
  const [convoSearch, setConvoSearch] = useState<string>("");
  const [messages, setMessages] = useState<User[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const { user } = useUser();

  if (!isLoaded || !userId) {
    return (
      <View className="bg-black flex-1">
        <Text className="text-white">You are not logged in</Text>
      </View>
    )
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

  let matchedSearchQuery = messages.filter((item: User) => item.firstName.toLowerCase().includes(convoSearch.toLowerCase()))

  useEffect(() => {
    checkClerkIdExists(userId);
    checkPersonalMessages([userId]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <View>
        {showSpinner ? (
          <View className="items-center justify-center h-full">
            <ActivityIndicator size="large" />
          </View>
        ) :
          <View style={{ width: '100%', height: '100%' }}>
            <FlatList
              data={matchedSearchQuery}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }: { item: User; }) => (
                <Pressable onPress={() => {
                  router.push(`/${item.clerkId}`)
                }}>
                  <View className="flex-row py-3">
                    <View className="pl-4">
                      {
                        item.pfp ?
                          <Image source={{ uri: item.pfp }}
                            className="rounded-full h-14 w-14"
                          /> :
                          <Image source={require("../../assets/images/defaultImage.png")}
                            className="rounded-full h-14 w-14"
                          />
                      }
                    </View>
                    <View className="px-3">
                      <View>
                        <Text className="text-white capitalize font-bold text-base">
                          {item.firstName + " " + item.lastName}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-white">Hello</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View className="items-center justify-center pt-20">
                  <Text className="text-gray-50 font-bold text-xl">
                    No Messages
                  </Text>
                </View>
              }
              ListHeaderComponent={
                <View className="py-3">
                  <Text className="text-gray-50 text-4xl font-bold px-5">Chats</Text>
                  <View className="px-4 pt-2">
                    <TextInput
                      className="bg-zinc-800 px-2 py-2 text-base rounded-xl
                      leading-5 text-white"
                      placeholder="Search..."
                      value={convoSearch}
                      placeholderTextColor="#8e8e8e"
                      onChangeText={(searchConvo) => setConvoSearch(searchConvo)}
                    />
                  </View>
                </View>
              }
            />
          </View>
        }
      </View>
    </SafeAreaView>
  );
}
