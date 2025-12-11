// Import necessary React Native components for UI

// Import navigation utilities from expo-router
import { Redirect } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Import SafeAreaView for handling safe areas on different devices
import { SafeAreaView } from "react-native-safe-area-context";
// Import local assets and utilities
import icons from "@/constants/icons"; // Custom icon assets
import images from "@/constants/images"; // Custom image assets
import { login } from "@/core/appwrite"; // Appwrite login function
import { useGlobalContext } from "@/core/global-provider"; // Global state context

// Define the Auth functional component
const Auth = () => {
  // Destructure global state variables for loading status, login status, and refetch function
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  // If not loading and already logged in, redirect to the home screen
  if (!loading && isLoggedIn) return <Redirect href={"/"} />;

  // Handler for the Google login button press
  const handleLogin = async () => {
    // Attempt to log in using the Appwrite service
    const result = await login();

    // If login is successful, refetch global context data
    if (result) {
      await refetch({});
    } else {
      // If login fails, display an alert to the user
      Alert.alert("Login Failed", "Unable to login. Please try again.");
    }
  };

  return (
    // SafeAreaView ensures content is not obscured by device notches or status bars
    <SafeAreaView className=" h-full">
      {/* ScrollView allows the content to be scrollable if it exceeds screen height */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {/* Onboarding image */}
        <Image
          source={images.onboarding}
          className="w-full h-4/6 backdrop-blur-lg bg-white/30"
          resizeMode="contain"
        ></Image>
        {/* Main content container with padding and negative margin to overlap the image */}
        <View className="px-10 -mt-10">
          {/* Welcome message */}
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Wellcome to ReState
          </Text>

          {/* Main title with a highlighted part */}
          <Text className="text-3xl font-rubik-bold text-center mt-2">
            Let’s get you closer to{}
            <Text className="text-primary-300">your ideal home</Text>
          </Text>

          {/* Login instruction text */}
          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to Real Scout with Google
          </Text>

          {/* Google login button */}
          <TouchableOpacity
            className="bg-white shadow-zinc-300 rounded-full w-full py-4 mt-5"
            onPress={handleLogin} // Attach the handleLogin function to the button press
          >
            {/* Container for the Google icon and text */}
            <View className="flex flex-row items-center justify-center">
              {/* Google icon */}
              <Image
                source={icons.google}
                className="h-5 w-5"
                resizeMode="contain"
              />
              {/* Button text */}
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
