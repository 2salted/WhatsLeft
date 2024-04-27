import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from 'expo-image-picker';

export default function settings() {
  const [image, setImage] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
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
    setShowSpinner(true);
    try {
      let dataUrl = "data:application/octet-binary;base64," + base64;
      await fetch(dataUrl)
        .then(async res => await res.arrayBuffer())
        .then(async buffer => {
          if (type === 'image/png' || type === 'image/jpeg') {
            const response = await fetch('http://192.168.0.148:3000/upload', {
              method: 'POST',
              headers: {
                'Content-Type': type,
              },
              body: new Uint8Array(buffer),
            })
            const data = await response.json();
            setShowSpinner(false)
          }
        })
    } catch (err) {
      setShowSpinner(false)
      console.log("error", err)
    }
  }

  useEffect(() => {
    checkClerkIdExists(userId)
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Text className='text-gray-50 text-4xl font-bold px-5'>Settings</Text>
      {showSpinner ?
        <View className="py-36">
          <ActivityIndicator size='large' />
        </View>
        :
        <View>
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
                <Text className="text-zinc-500 text-lg leading-6">Available</Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => {
              signOut();
            }}>
            <View className=" px-5 py-2">
              <View className="items-center p-2.5 bg-zinc-800 rounded-lg">
                <Text className="text-lg font-bold text-red-600">Sign Out</Text>
              </View>
            </View>
          </Pressable>
          <View>
            <Text className="text-center p-2 text-sm text-zinc-700">App version: 1.0.0</Text>
          </View>
        </View>
      }

    </SafeAreaView>
  );
};
