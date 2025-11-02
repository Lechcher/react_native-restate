import { useGlobalContext } from "@/core/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
  const { loading, isLoggedIn } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex justify-center h-full items-center">
        <ActivityIndicator className="text-primary-300" size={"large"} />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) return <Redirect href={"/auth"} />;

  return <Slot />;
};

export default AppLayout;
