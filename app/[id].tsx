import { FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router/stack";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { Socket, io } from "socket.io-client";

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
  const [receiverUserInfo, setReceiverUserInfo] = useState<User>()
  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<{ message: string, senderId: string, receiverId: string }[]>([]);
  const socket = useRef<Socket | null>(null)
  const [socketID, setSocketID] = useState<string | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkForImage(otherUserId)
    getMessages(userId ?? "", otherUserId)
    socket.current = io(`http://192.168.0.148:${8000}`)
    const onConnect = () => {
      console.log(`Connected to server! Socket ID: ${socket.current?.id}`)
      socket.current?.emit("userId", userId)

      setSocketID(socket.current?.id);
      setIsConnected(true);
    }

    const onDisconnect = () => {
      console.log(`Disconnected from server!`)

      setSocketID("");
      setIsConnected(false);
    }

    socket.current.on("connect", onConnect);
    socket.current.on("disconnect", onDisconnect);
    socket.current.on("newMessage", (message: { message: string, senderId: string, receiverId: string }) => {
      setAllMessages(prev => [...prev, message])
    })

    return () => {
      socket.current?.off("connect", onConnect);
      socket.current?.off("disconnect", onDisconnect);
    }
  }, []);

  async function getMessages(userId: string, otherUserId: string | string[] | undefined) {
    try {
      const response = await fetch("http://192.168.0.148:3000/dms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otherUserId }),
      })
      const data = await response.json()
      if (data.messages) {
        setAllMessages(data.messages)
      } else {
        setAllMessages([])
      }
      if (data.otherUser) {
        setReceiverUserInfo(data.otherUser)
      }
    } catch (err) {
      console.error("Error fetching messages", err)
    }
  }

  async function sendMessage(userId: string, otherUserId: string | string[] | undefined, message: string) {
    try {
      const response = await fetch("http://192.168.0.148:3000/addMessagesToDB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otherUserId, message }),
      })
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.error("ERROR FETCHING MESSAGES", err)
    }
  }

  const checkForImage = async (userId: string | string[] | undefined) => {
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

  let css = ""
  Platform.OS === "ios" ? css = "bg-neutral-700 text-white p-2 rounded-full border border-neutral-600" :
    css = "bg-neutral-700 text-white p-1 rounded-full border border-neutral-600"

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
            headerStyle: { backgroundColor: "#262626" },
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <View className="flex-1 items-center">
          <FlatList
            data={allMessages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              item.senderId === userId || item.senderId === otherUserId ?
                <View>
                  <Text className={item.receiverId !== userId ? "text-green-600" : "text-gray-600"}>{item.message}</Text>
                </View>
                :
                <View></View>
            )}
          />
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}>
        <View className="bg-neutral-800 text-lg pb-6 pt-3 px-4 text-white">
          <View className="pb-4 flex-row">
            <View className="flex-1 pr-4">
              <TextInput
                className={css}
                value={userMessage}
                placeholderTextColor="#8e8e8e"
                onChangeText={(message) => setUserMessage(message)}
              />
            </View>
            <TouchableOpacity className="rounded-full justify-center bg-green-500" onPress={() => {
              if (userMessage.trim() !== "") {
                setUserMessage("")
                sendMessage(userId ?? "", otherUserId, userMessage ?? "")
                socket.current?.emit("sendMessage",
                  { message: userMessage, senderId: userId, receiverId: otherUserId }, (val: unknown) => {
                    setAllMessages((prevMessages) =>
                      [...prevMessages, {
                        message: userMessage ?? "",
                        senderId: userId as string,
                        receiverId: otherUserId as string
                      }])
                  });
              }
            }}>
              <Ionicons name="send" size={20} color="black" style={{ marginRight: 6, marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View >
  )
}
