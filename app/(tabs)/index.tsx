import { useAuth, useUser } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, SafeAreaView, ScrollView, View, TextInput } from 'react-native';

export default function Tab() {
  const { isLoaded, userId, sessionId } = useAuth();
  const [convoSearch, setConvoSearch] = useState<string>("");
  const [messages, setMessages] = useState<Array<any>>();
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

  async function checkPersonalMessages(userIdEndPoint: string[]) {
    try {
      const response = await fetch('http://192.168.0.148:3000/personalMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdEndPoint })
      });
      const data = await response.json();
      setMessages(data.filter((item: any) => item.clerkId !== userId))
      return data;
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Failed to fetch data' };
    }
  };

  useEffect(() => {
    checkClerkIdExists(userId);
  }, [convoSearch]);

  useEffect(() => {
    checkPersonalMessages([userId])
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <ScrollView>
        <Text className='text-gray-50 text-4xl font-bold px-5'>Chats</Text>
        <View className='px-4 pb-3 pt-3'>
          <TextInput
            className="bg-zinc-800 px-2 py-2 text-base rounded-xl
            leading-5 text-white"
            placeholder="Search..."
            value={convoSearch}
            placeholderTextColor="#8e8e8e"
            onChangeText={((searchConvo) => setConvoSearch(searchConvo))}
          />
          <View>
            {messages?.map((convo, index) => {
              return (
                <Text key={index} className='text-gray-50'>{convo.firstName}</Text>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
