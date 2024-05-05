import { FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router/stack";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';

type User = {
  firstName: string;
  lastName: string;
  clerkId: string;
  pfp: string;
};

export default function Messaging(): React.JSX.Element {
  const { userId } = useAuth()
  const userIdSecondObject = useLocalSearchParams()
  const otherUserId = userIdSecondObject.id
  const [image, setImage] = useState<string>("")
  const [receiverUserInfo, setreceiverUserInfo] = useState<User>()
  const [userMessage, setUserMessage] = useState<string>();
  const [messages, setMessages] = useState<any>();

  async function get15Messages(userId: string, otherUserId: any) {
    try {
      const response = await fetch("http://192.168.0.148:3000/dms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otherUserId }),
      })
      const data = await response.json()
      setreceiverUserInfo(data.otherUser)
    } catch (err) {
      console.error("Error fetching messages", err)
    }
  }

  const checkForImage = async (userId: any) => {
    try {
      const response = await fetch("http://192.168.0.148:3000/findImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setImage(data.pfp);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    checkForImage(otherUserId)
    get15Messages(userId ?? "", otherUserId)
  }, [])

  console.log(messages)

  return (
    <View className="flex-1 bg-neutral-900">
      <SafeAreaView className="flex-1 bg-black">
        <Stack.Screen
          options={{
            headerTitle: () => (
              <View className="flex-1">
                <View className="flex-row pl-2">
                  {!image ? (
                    <Image
                      source={require("../assets/images/defaultImage.png")}
                      className="rounded-full h-9 w-9"
                    />
                  ) : (
                    <Image
                      source={{ uri: image }}
                      className="h-9 w-9 rounded-full"
                    />
                  )}
                  <View className="pr-20">
                    <Text className="pl-2 text-base font-bold leading-5 text-white capitalize">{receiverUserInfo &&
                      receiverUserInfo.firstName + " " + receiverUserInfo?.lastName}</Text>
                    <Text className="pl-2 text-sm leading-4 text-neutral-500 capitalize">Available</Text>
                  </View>
                </View>
              </View>
            ),
            headerRight: () => (
              <View className="pr-7">
                <TouchableOpacity>
                  <FontAwesome style={{ color: "white", fontSize: 25 }} name="phone" />
                </TouchableOpacity>
              </View>
            ),
            headerBackTitle: "",
            headerStyle: { backgroundColor: "black" },
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <View className="flex-1">
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <View className="bg-neutral-800 text-lg pb-6 pt-3 px-4 text-white">
          <View className="pb-4 flex-row">
            <View className="flex-1 pr-4">
              <TextInput
                className="bg-neutral-700 text-white p-2 rounded-full border border-neutral-600"
                value={userMessage}
                placeholderTextColor="#8e8e8e"
                onChangeText={(message) => setUserMessage(message)}
              />
            </View>
            <TouchableOpacity className="rounded-full justify-center bg-green-500" onPress={() => {
              setMessages(userMessage)
            }}>
              <Ionicons name="send" size={20} color="black" style={{ marginRight: 6, marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View >
  )
}