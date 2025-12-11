// Imports for React Native components
import { Image, Text, View } from "react-native";

// Imports for image assets
import images from "@/constants/images";

// NoResults component definition
const NoResults = () => {
  return (
    // Main container for the No Results message, centered vertically
    <View className="flex items-center my-5">
      {/* Image displayed when no results are found */}
      <Image
        source={images.noResult} // Source of the no result image
        className="w-11/12 h-80" // Tailwind CSS classes for width and height
        resizeMode="contain" // Image resize mode to fit within bounds
      />
      {/* Title for the No Results message */}
      <Text className="text-2xl font-rubik-bold text-black-300 mt-5">
        No Result
      </Text>
      {/* Subtitle providing more context */}
      <Text className="text-base text-black-100 mt-2">
        We could not find any result
      </Text>
    </View>
  );
};

export default NoResults;
