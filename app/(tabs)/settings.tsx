import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable, Image } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from 'expo-image-picker';

export default function settings() {
  const [image, setImage] = useState('');
  const { isLoaded, userId, sessionId, signOut } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !userId) {
    return null;
  }

  const checkClerkIdExists = async (clerkId: string) => {
    try {
      const response = await fetch(`http://192.168.0.148:3000/${clerkId}`);
      if (!response.ok) {
        throw new Error('Failed to check clerk ID');
      }
      const data = await response.json();
      console.log('Clerk ID exists:', data.exists);
      if (!data.exists && sessionId) {
        console.log('Clerk ID exists:', data.exists);
        fetch('http://192.168.0.148:3000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: user?.firstName,
            lastName: user?.lastName,
            clerkId: userId,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      sendImageToApi(result.assets[0].base64, result.assets[0].mimeType)
    }
  };

  async function sendImageToApi(base64: any, type: any) {
    if (type === 'image/png' || type === 'image/jpeg') {
      const response = await fetch('http://192.168.0.148:3000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: JSON.stringify({ base64 })
      });
      const data = await response.json();
      return data
    }
  }

  useEffect(() => {
    checkClerkIdExists(userId)
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Text className='text-gray-50 text-4xl font-bold px-5'>Settings</Text>
      <View className="px-5 py-3">
        <View className="bg-zinc-800 rounded-lg p-3 flex-row">
          <Pressable onPress={pickImage}>
            {!image ?
              <Image source={require('../../assets/images/defaultImage.png')} className="rounded-full h-14 w-14" />
              :
              <Image source={{ uri: image }} className="h-14 w-14 rounded-full" />
            }
          </Pressable>
          <View className="pl-3 justify-center">
            <Text className="text-gray-50 text-xl capitalize leading-6">{user?.firstName}</Text>
            <Text className="text-gray-400 text-lg leading-6">Available</Text>
          </View>
        </View>
      </View>
      <View className="items-center py-5">
        <Pressable
          onPress={() => {
            signOut();
          }}>
          <Text className="text-white">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
