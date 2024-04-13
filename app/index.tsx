import { useAuth } from '@clerk/clerk-expo';
import { View, Text } from 'react-native';

export default function Tab() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <Text>
      Hello, {userId} your current active session is {sessionId}
    </Text>
  );
}
