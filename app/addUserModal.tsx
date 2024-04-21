import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';

type User = {
  firstName: string,
  lastName: string,
  clerkId: string,
  user: object
}

export default function addUserModal() {
  let randomStringId = "";
  const [searchUser, setSearchUser] = useState<string>("");
  const [usersData, setUsersData] = useState<User[] | undefined>(undefined);
  const [showSpinner, setShowSpinner] = useState<boolean>(false)
  const { userId } = useAuth();

  async function createNewConvo(users: Array<any>, id: string) {
    setShowSpinner(true)
    try {
      await fetch('http://192.168.0.148:3000/createConvo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users, id })
      }).then(response => response.json())
        .then(data => {
          setShowSpinner(false)
          console.log('Success:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function createRandomString(length: any) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      randomStringId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomStringId;
  }

  async function fetchUsers() {
    try {
      setShowSpinner(true)
      const response = await fetch('http://192.168.0.148:3000/search');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error fetching users');
      return []
    }
  }

  useEffect(() => {
    fetchUsers()
      .then(users => {
        setUsersData(users.filter((user: any) => user.clerkId !== userId))
        setShowSpinner(false)
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-[#1e1e1e]'>
      <ExpoStatusBar style='light' hidden={false} />
      <View className='flex-col'>
        <View className='px-4 pb-3'>
          <TextInput
            className="bg-zinc-700 px-2 py-2 text-base rounded-xl
            leading-5 text-white"
            placeholder="Search users by name"
            value={searchUser}
            placeholderTextColor="#8e8e8e"
            onChangeText={(searchUser) => setSearchUser(searchUser)}
          />
        </View>
        <ScrollView className='px-4'>
          {showSpinner ? <ActivityIndicator size='large' />
            : usersData?.map((user, index) => {
              return (
                <View key={index} className="py-3">
                  <TouchableOpacity className='p-3 bg-[#2e2e2e] rounded-xl flex-row' onPress={() => {
                    createRandomString(38);
                    createNewConvo([userId, user.clerkId], randomStringId);
                  }}>
                    <Text className='text-gray-50 text-base font-bold'>{user.firstName}</Text>
                  </TouchableOpacity>
                </View>
              )
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
