// UI components for cards, filters, empty state, and search
import { Card } from "@/components/Cards";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";

// Data helpers and global app state
import { getProperties } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { useAppwrite } from "@/hooks/useAppwrite";

// Router utilities for navigation and reading URL query params
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

const Explore = () => {
  // Global app loading and auth state
  const { loading, isLoggedIn } = useGlobalContext();

  // Navigation helper for pushing routes and going back
  const router = useRouter();

  // Read query params from URL: `query` for text search, `filter` for category
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // Properties list state via custom Appwrite hook.
  // `skip: true` prevents initial fetch; we trigger it in useEffect based on params.
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
      limit: 20,
    },
    skip: true,
  });

  // Refetch whenever `filter` or `query` changes to update the grid results.
  useEffect(() => {
    refetch({
      // biome-ignore lint/style/noNonNullAssertion: If filter is undefined, fetch all properties
      filter: params.filter!,
      // biome-ignore lint/style/noNonNullAssertion: If query is undefined, fetch all properties
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query, refetch]);

  // Navigate to property details when a card is pressed
  const handleCardPress = (propertyId: string) =>
    router.push(`/properties/${propertyId}`);

  // If not authenticated after loading, redirect to auth screen
  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  // UI layout: header (back, title, bell), search + filter, results count, grid list
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex flex-row items-center justify-between px-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
        >
          <Image source={icons.backArrow} className="size-5" />
        </TouchableOpacity>

        <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
          Search for Your Ideal
        </Text>

        <Image source={icons.bell} className="w-6 h-6" />
      </View>

      <View className="px-5 pb-2">
        <Search />

        <View className="mt-5">
          <Filter />
        </View>

        <View className="mt-5">
          <Text className="text-xl font-rubik-bold text-black-300">
            Found {properties?.length || 0}{" "}
            {properties?.length === 1 ? "property" : "properties"}
          </Text>
        </View>
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
      />
    </SafeAreaView>
  );
};

export default Explore;
