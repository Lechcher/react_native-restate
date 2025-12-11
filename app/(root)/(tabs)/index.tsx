// UI components used on the home screen
import { Card, FeaturedCard } from "@/components/Cards";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";

// Data helpers and global state
import { getFeaturedProperties, getProperties } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { useAppwrite } from "@/hooks/useAppwrite";

// Router utilities
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

// Returns a greeting based on the current local time
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
  // Global user and authentication state
  const { user, loading, isLoggedIn } = useGlobalContext();

  // Navigation helper
  const router = useRouter();

  // Read query params used for searching/filtering
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // Featured properties: fetched immediately on mount
  const { data: featuredProperties, loading: featuredPropertiesLoading } =
    useAppwrite({
      fn: () => getFeaturedProperties(),
    });

  // Grid properties: skip initial fetch, refetch when query/filter changes
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

  // Update properties list when search/filter inputs change
  useEffect(() => {
    refetch({
      // biome-ignore lint/style/noNonNullAssertion: If filter is undefined, fetch all properties
      filter: params.filter!,
      // biome-ignore lint/style/noNonNullAssertion: If query is undefined, fetch all properties
      query: params.query!,
      limit: 10,
    });
  }, [params.filter, params.query, refetch]);

  // Navigate to property details
  const handleCardPress = (propertyId: string) =>
    router.push(`/properties/${propertyId}`);

  // If user is not authenticated, redirect to auth screen
  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  // UI layout: header (avatar, greeting, bell), search, featured list, grid
  return (
    <SafeAreaView className="bg-white h-full">
      {/* Top header with avatar, time-based greeting, and notifications */}
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

        {/* Search input */}
        <Search />
      </View>

      {/* Properties grid list with header showing featured section and filter */}
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

              {/* Featured properties carousel */}
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
            {/* Filters used to refine grid results */}
            <Filter />
          </View>
        }
      />
    </SafeAreaView>
  );
}
