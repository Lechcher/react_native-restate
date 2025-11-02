import icons from "@/constants/icons";
import images from "@/constants/images";
import { login } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { Redirect } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Auth = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href={"/"} />;

  const handleLogin = async () => {
    const result = await login();

    if (result) {
      refetch();
    } else {
      Alert.alert("Login Failed", "Unable to login. Please try again.");
    }
  };

  return (
    <SafeAreaView className=" h-full">
      {/* Auth screen content goes here */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Image
          source={images.onboarding}
          className="w-full h-4/6 backdrop-blur-lg bg-white/30"
          resizeMode="contain"
        ></Image>
        <View className="px-10 -mt-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Wellcome to ReState
          </Text>

          <Text className="text-3xl font-rubik-bold text-center mt-2">
            Let’s get you closer to{`\n`}
            <Text className="text-primary-300">your ideal home</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to Real Scout with Google
          </Text>

          <TouchableOpacity
            className="bg-white shadow-zinc-300 rounded-full w-full py-4 mt-5"
            onPress={handleLogin}
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="h-5 w-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik text-black-200 text-center ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
