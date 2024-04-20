import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';

type User = {
  firstName: string,
  lastName: string,
  clerkId: string,
  user: object
}
interface provider {
  firstUser: string,
  secondUser: string,
}
type convoType = {
  user: object,
  clerkId: string
}

export default function addUserModal() {
  const [searchUser, setSearchUser] = useState<string>("");
  const [usersData, setUsersData] = useState<User[] | undefined>(undefined);
  const [showSpinner, setShowSpinner] = useState<boolean>(false)
  const [foundConvos, setFoundConvos] = useState<Array<provider>>();
  const { userId } = useAuth();

  async function createNewConvo(users: Array<any>) {
    try {
      fetch('http://192.168.0.148:3000/createConvo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users })
      }).then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function fetchConvo() {
    try {
      setShowSpinner(true)
      const response = await fetch('http://192.168.0.148:3000/convos')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error Fetching Convo');
      return []
    }
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
        setShowSpinner(false)
        console.error('Error fetching users:', error);
      });
  }, [searchUser])

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
                    createNewConvo([userId, user.clerkId])
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
