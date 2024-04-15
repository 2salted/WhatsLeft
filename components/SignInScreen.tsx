import React from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

export default function SignInScreen({ setTest }: any) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black items-center">
      <View className="w-11/12">
        <Text className="text-white text-4xl font-bold pt-12 pb-3">Sign In</Text>
        <View className="py-3">
          <TextInput
            className="bg-zinc-700 px-2 py-3 text-base rounded-xl
            leading-5 text-white"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            placeholderTextColor="#d3d3d3"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>

        <View className="py-3">
          <TextInput
            className="bg-zinc-700 px-2 py-3 text-base rounded-xl
            leading-5 text-white"
            value={password}
            placeholder="Password..."
            placeholderTextColor="#d3d3d3"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <View className="justify-between py-2 flex-row">
          <TouchableOpacity className="px-3" onPress={() => { setTest(false) }}>
            <Text className="text-blue-500 font-bold text-lg">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-3" onPress={onSignInPress}>
            <Text className="text-blue-500 font-bold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
