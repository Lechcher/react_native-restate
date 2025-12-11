// Core React Native UI primitives
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Navigation redirect and safe area wrapper
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Local UI components and constants
import Separator from "@/components/ui/Separator";
import SettingsItem from "@/components/SettingsItem";
import icons from "@/constants/icons";
import { logout } from "@/core/appwrite";
import { settings } from "@/constants/data";
import { useGlobalContext } from "@/core/global-provider";

const Profile = () => {
  // Global state: user info, loading/auth status, and refetch helper
  const { refetch, user, loading, isLoggedIn } = useGlobalContext();

  // Protect route: redirect unauthenticated users once loading completes
  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  // Logout handler: calls backend logout and refreshes global state
  const handerLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Logout Successful", "You have been logged out.");
      await refetch({});
    } else {
      Alert.alert("Logout Failed", "Unable to logout. Please try again.");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      {/* Header: screen title and notifications icon */}
      <View className="flex flex-row items-center justify-between px-7">
        <Text className="text-xl font-rubik-bold">Profile</Text>
        <Image source={icons.bell} className="size-5" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-7"
      >
        {/* Profile avatar, edit button, and display name */}
        <View className="flex-row justify-center flex">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar }}
              className="size-44 relative rounded-full"
            />

            <TouchableOpacity className="absolute right-5 bottom-10">
              <Image source={icons.edit} className="size-9"></Image>
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">
              Lechcher Archson
            </Text>
          </View>
        </View>

        {/* Quick settings shortcuts with separators */}
        <View className="flex flex-col mt-5">
          <Separator />
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
          <Separator />
        </View>

        {/* Other settings mapped from constants */}
        <View className="flex flex-col">
          {settings.slice(2).map((item) => (
            <SettingsItem key={item.title} {...item} />
          ))}
        </View>

        {/* Logout action */}
        <View className="flex flex-col">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handerLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
