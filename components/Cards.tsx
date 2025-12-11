// Import necessary React Native components for UI
import { Image, Text, TouchableOpacity, View } from "react-native";

// Import local assets and types
import icons from "@/constants/icons"; // Custom icon assets
import images from "@/constants/images"; // Custom image assets
import type { Models } from "react-native-appwrite"; // Appwrite models for data typing

// Define the props interface for both Card components
interface CardProps {
  item: Models.Row & any; // The data item to display, typically a property object
  onPress?: () => void; // Optional callback function for when the card is pressed
}

// FeaturedCard component for displaying prominent property listings
const FeaturedCard = ({ item, onPress }: CardProps) => {
  return (
    // TouchableOpacity makes the entire card tappable
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-center w-60 h-80 relative"
    >
      {/* Property image */}
      <Image source={{ uri: item.image }} className="size-full rounded-2xl" />
      {/* Gradient overlay for better text readability */}
      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      {/* Rating display */}
      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />

        <Text className="text-xs font-rubik-bold text-primary-300 ml-1">
          {item.rating}
        </Text>
      </View>

      {/* Property details (name, address, price, favorite icon) */}
      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-rubik-extrabold text-white"
          numberOfLines={1} // Truncate long names with ellipses
        >
          {item.name}
        </Text>

        <Text className="text-base font-rubik text-white">{item.address}</Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-xl font-rubik-extrabold text-white">
            ${item.price}
          </Text>

          <Image source={icons.heart} className="size-5" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Standard Card component for general property listings
const Card = ({ item, onPress }: CardProps) => {
  return (
    // TouchableOpacity makes the entire card tappable
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-1 px-3 py-4 mt-4 w-full rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
    >
      {/* Rating display (hardcoded for now, consider using item.rating) */}
      <View className="flex flex-row items-center bg-white/90 px-2 p-1 rounded-full absolute top-5 right-5 z-50">
        <Image source={icons.star} className="size-2.5" />

        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          4.4
        </Text>
      </View>

      {/* Property image */}
      <Image source={{ uri: item.image }} className="w-full h-40 rounded-lg" />

      {/* Property details (name, address, price, favorite icon) */}
      <View className="flex flex-col mt-2">
        <Text className="text-xl font-rubik-bold text-black-300">
          {item.name}
        </Text>

        <Text className="text-xs font-rubik text-black-200">
          {item.address}
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">
            ${item.price}
          </Text>

          <Image
            source={icons.heart}
            className="size-5 mr-2"
            tintColor="#191d31" // Custom tint color for the heart icon
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Export both Card components for use throughout the application
export { Card, FeaturedCard };
