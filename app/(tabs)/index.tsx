import { useAuth } from '@clerk/clerk-expo';
import { Link, Stack } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';

export default function Tab() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <View>
        <Text className='text-gray-50 text-4xl font-bold px-5'>Chats</Text>
        <Link href="/addUserModal" className='text-gray-50'>Present modal</Link>
      </View>
    </SafeAreaView>
  );
}
