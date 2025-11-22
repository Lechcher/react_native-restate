import { Card, FeaturedCard } from "@/components/Cards";
import Filter from "@/components/Filter";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/core/global-provider";
import { Redirect, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const caculateTimeBasedGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good Morning!";
  } else if (currentHour < 18) {
    return "Good Afternoon!";
  } else {
    return "Good Evening!";
  }
};

export default function Index() {
  const { user, loading, isLoggedIn } = useGlobalContext();

  const router = useRouter();

  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{ uri: user?.avatar }}
                className="size-12 rounded-full"
              />
            </TouchableOpacity>

            <View className="flex flex-col items-start ml-2">
              <Text className="text-xs font-rubik text-black-100">{`${caculateTimeBasedGreeting()}`}</Text>
              <Text className="text-base font-rubik-medium text-black-300">{`${user?.name}`}</Text>
            </View>
          </View>

          <Image source={icons.bell} className="size-6" />
        </View>

        <Search />

        <View className="py-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">
              Featured
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row gap-5">
          <FeaturedCard />
          <FeaturedCard />
          <FeaturedCard />
        </View>

        <View className="py-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">
              Our Recommendation
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Filter />

        <View className="flex flex-row gap-5">
          <Card />
          <Card />
        </View>
      </View>
    </SafeAreaView>
  );
}
