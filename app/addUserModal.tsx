import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function addUserModal() {
  const isPresented = router.canGoBack();
  return (
    <View className='flex-1 bg-[#1e1e1e]'>
      { /*!*/isPresented && <Link href="../">Dismiss</Link>}
      <StatusBar style="light" />
    </View>
  )
}
