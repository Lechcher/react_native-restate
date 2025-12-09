import { Card, FeaturedCard } from "@/components/Cards";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getFeaturedProperties, getProperties } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { useAppwrite } from "@/hooks/useAppwrite";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: featuredProperties, loading: featuredPropertiesLoading } =
    useAppwrite({
      fn: () => getFeaturedProperties(),
    });

  const {
    data: properties,
    loading: propertiesLoading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      // biome-ignore lint/style/noNonNullAssertion: If filter is undefined, fetch all properties
      filter: params.filter!,
      // biome-ignore lint/style/noNonNullAssertion: If query is undefined, fetch all properties
      query: params.query!,
      limit: 10,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      // biome-ignore lint/style/noNonNullAssertion: If filter is undefined, fetch all properties
      filter: params.filter!,
      // biome-ignore lint/style/noNonNullAssertion: If query is undefined, fetch all properties
      query: params.query!,
      limit: 10,
    });
  }, [params.filter, params.query, refetch]);

  const handleCardPress = (propertyId: string) =>
    router.push(`/properties/${propertyId}`);

  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5 pb-2">
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
      </View>

      <FlatList
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32 px-5"
        columnWrapperClassName="flex gap-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          propertiesLoading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View>
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

              {featuredPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !featuredProperties || featuredProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={featuredProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                  bounces={false}
                />
              )}
            </View>
            <View className="py-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendation
                </Text>

                <TouchableOpacity onPress={() => router.push("/explore")}>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Filter />
          </View>
        }
      />
    </SafeAreaView>
  );
}
