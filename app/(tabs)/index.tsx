import { useAuth } from '@clerk/clerk-expo';
import { View, Text, SafeAreaView } from 'react-native';

export default function Tab() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <View>
        <Text className='text-gray-50'>Chats</Text>
      </View>
    </SafeAreaView>
  );
}
