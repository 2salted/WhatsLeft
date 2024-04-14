import * as React from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black items-center">
      {!pendingVerification && (
        <View className="w-11/12">
          <Text className="text-white text-4xl font-bold pt-12 pb-5">Sign Up</Text>
          <View className="flex-row w-full">
            <View className="py-3 pr-2 w-2/4">
              <TextInput
                className="bg-zinc-700 px-2 py-3 text-base rounded-xl
              leading-5 text-white"
                autoCapitalize="none"
                value={firstName}
                placeholder="First Name"
                placeholderTextColor="#d3d3d3"
                onChangeText={(firstName) => setFirstName(firstName)}
              />
            </View>
            <View className="py-3 pl-2 w-2/4">
              <TextInput
                className="bg-zinc-700 px-2 py-3 text-base rounded-xl
               leading-5 text-white"
                autoCapitalize="none"
                value={lastName}
                placeholder="Last Name..."
                placeholderTextColor="#d3d3d3"
                onChangeText={(lastName) => setLastName(lastName)}
              />
            </View>

          </View>
          <View className="py-3">
            <TextInput
              className="bg-zinc-700 px-2 py-3 text-base rounded-xl
              leading-5 text-white"
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              placeholderTextColor="#d3d3d3"
              onChangeText={(email) => setEmailAddress(email)}
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
          <View className="items-end p-2">
            <TouchableOpacity onPress={onSignUpPress} className="px-2">
              <Text className="text-blue-500 font-bold text-lg">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {pendingVerification && (
        <View>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify}>
            <Text>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
