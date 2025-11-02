import { logout } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { Link, Redirect } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { refetch, loading, isLoggedIn, user } = useGlobalContext();

  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  const handerLogout = async () => {
    const result = await logout();

    if (result) {
      refetch();
    } else {
      Alert.alert("Login Failed", "Unable to login. Please try again.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-bold text-lg my-10 font-rubik">
        Wellcome to ReState
      </Text>
      <Link href={"/auth"}>Auth</Link>
      <Link href={"/explore"}>Explore</Link>
      <Link href={"/profile"}>Profile</Link>
      <Link href={"/properties/1"}>Property</Link>

      <TouchableOpacity onPress={handerLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
