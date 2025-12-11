// Import necessary React Native components for UI
import { Image, Text, View } from "react-native";

import type { Models } from "react-native-appwrite"; // Appwrite models for data typing
// Import local assets and types
import icons from "@/constants/icons"; // Custom icon assets

// Define the props interface for the Comment component
interface CommentProps {
  item: Models.Row & {
    // The data item representing a comment
    avatar: string; // URL for the commenter's avatar
    name: string; // Name of the commenter
  };
}

// Comment component for displaying individual user comments
const Comment = ({ item }: CommentProps) => {
  return (
    // Main container for a single comment, aligned to the start
    <View className="flex flex-col items-start">
      {/* Container for avatar and commenter's name */}
      <View className="flex flex-row items-center">
        {/* Commenter's avatar */}
        <Image source={{ uri: item.avatar }} className="size-14 rounded-full" />

        {/* Commenter's name */}
        <Text className="text-base text-black-300 text-start font-rubik-bold ml-3">
          {item.name}
        </Text>

        {/* Container for like count and comment date, positioned below name */}
        <View className="flex flex-row items-center w-full justify-between mt-4">
          {/* Like count section */}
          <View className="flex flex-row items-center">
            {/* Heart icon for likes */}
            <Image
              source={icons.heart}
              className="size-5"
              tintColor={"#0061FF"} // Custom tint color for the heart icon
            />

            {/* Hardcoded like count (consider making dynamic) */}
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              120
            </Text>
          </View>

          {/* Comment creation date */}
          <Text className="text-black-100 text-sm font-rubik">
            {new Date(item.$createdAt).toDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Comment;
