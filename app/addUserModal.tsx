"use strict";

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

type User = {
  firstName: string;
  lastName: string;
  clerkId: string;
};

type Contact = {
  firstName: string;
};

export default function addUserModal(): React.JSX.Element {
  let randomStringId = "";
  const [searchUser, setSearchUser] = useState<string>("");
  const [usersData, setUsersData] = useState<User[] | undefined>(undefined);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>();
  const { userId, isLoaded } = useAuth();

  if (!isLoaded || !userId) {
    return <View />;
  }

  async function createNewConvo(users: string[], id: string) {
    setShowSpinner(true);
    try {
      await fetch("http://192.168.0.148:3000/createConvo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users, id }),
      })
        .then((response) => response.json())
        .then((data) => {
          setShowSpinner(false);
          router.replace("/");
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function createRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      randomStringId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomStringId;
  }

  async function fetchUsers(): Promise<User[]> {
    setShowSpinner(true);
    try {
      const response = await fetch("http://192.168.0.148:3000/search");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data: User[] | null | undefined = (await response.json()) as
        | User[]
        | null
        | undefined;

      data ?? setShowSpinner(false);
      return data ?? [];
    } catch (error: unknown) {
      console.error("Error fetching users");
      return [];
    }
  }

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <View key={index} className="py-3">
      <TouchableOpacity
        className="p-3 bg-[#2e2e2e] rounded-xl flex-row"
        onPress={() => {
          createRandomString(38);
          createNewConvo([userId, item.clerkId], randomStringId);
        }}
      >
        <Text className="text-white text-base font-bold">{item.firstName}</Text>
      </TouchableOpacity>
    </View>
  );

  async function checkPersonalMessages(
    userIdEndPoint: string[],
  ): Promise<User[] | { error: string }> {
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
      const data: User[] = await response.json();
      setContacts(data.filter((item) => item.clerkId !== userId));
      setShowSpinner(false);
      return data;
    } catch (error) {
      console.error("Error: ", error);
      return { error: "Failed to fetch data" };
    }
  }

  useEffect(() => {
    checkPersonalMessages([userId]);
    fetchUsers()
      .then((users) => {
        setUsersData(users.filter((user: User) => user.clerkId !== userId));
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#1e1e1e]">
      <ExpoStatusBar style="light" hidden={false} />
      <View className="flex-col">
        <View className="px-4 pb-3">
          <TextInput
            className="bg-neutral-700 px-2 py-2 text-base rounded-xl
            leading-5 text-white"
            placeholder="Search users by name"
            value={searchUser}
            placeholderTextColor="#8e8e8e"
            onChangeText={(searchUser) => setSearchUser(searchUser)}
          />
        </View>
        <View className="px-4">
          {showSpinner ? (
            <View className="pt-32">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View className="pb-12">
              <FlatList
                data={usersData}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
              />
            </View>
          )}
          {showSpinner ? (
            <View className="pt-32">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View>
              <Text className="text-neutral-500 text-base px-4 font-bold">
                Your WhatsLeft Contacts
              </Text>
              <FlatList
                data={contacts}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View className="py-3">
                    <TouchableOpacity
                      className="p-3 bg-[#2e2e2e] rounded-xl flex-row"
                      onPress={() => {}}
                    >
                      <Text className="text-gray-50 text-base font-bold">
                        {item.firstName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
