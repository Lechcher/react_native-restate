import { Card } from "@/components/Cards";
import Filter from "@/components/Filter";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getProperties } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { useAppwrite } from "@/hooks/useAppwrite";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const { loading, isLoggedIn } = useGlobalContext();

  const [page, setPage] = useState(1);

  const router = useRouter();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

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

  useEffect(() => {
    refetch({
      // biome-ignore lint/style/noNonNullAssertion: If filter is undefined, fetch all properties
      filter: params.filter!,
      // biome-ignore lint/style/noNonNullAssertion: If query is undefined, fetch all properties
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query, refetch]);

  const handleCardPress = (propertyId: string) =>
    router.push(`/properties/${propertyId}`);

  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

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
