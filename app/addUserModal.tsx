import { SafeAreaView, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
export default function addUserModal() {

  return (
    <SafeAreaView className='flex-1 bg-[#1e1e1e]'>
      <ExpoStatusBar style='light' hidden={false} />
      <View className='flex-col'>
        <View className='px-4'>
          <TextInput
            className="bg-zinc-700 px-2 py-2 text-base rounded-xl
          leading-5 text-white"
            placeholder="Search users by name"
            placeholderTextColor="#8e8e8e"
          />
        </View>
        <View>

        </View>
      </View>
    </SafeAreaView>
  )
}
