import { useAuth } from '@clerk/clerk-expo';
import { View, Text, SafeAreaView } from 'react-native';

export default function Tab() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: 'black'
    }}>
      <View>
        <Text className='text-white'>
          Hello, {userId} your current active session is {sessionId}
        </Text>
      </View>
    </SafeAreaView>
  );
}
