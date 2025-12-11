// Imports for icons and React Native components

import icons from "@/constants/icons";
import {
  Image,
  type ImageSourcePropType, // Type for image sources
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Interface defining the props for the SettingsItem component
interface SettingsItemProps {
  icon: ImageSourcePropType; // Icon to display on the left of the item
  title: string; // Title text for the settings item
  onPress?: () => void; // Optional function to call when the item is pressed
  textStyle?: string; // Optional Tailwind CSS classes for the title text
  showArrow?: boolean; // Optional flag to show/hide the right arrow icon, defaults to true
}

// SettingsItem component definition
const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true, // Default value for showArrow prop
}: SettingsItemProps) => {
  return (
    // TouchableOpacity makes the entire item tappable
    <TouchableOpacity
      onPress={onPress} // Attach the onPress handler
      className="flex flex-row items-center justify-between py-3" // Styling for the item layout
    >
      {/* Container for the icon and title */}
      <View className="flex flex-row items-center gap-3">
        {/* Display the icon */}
        <Image source={icon} className="size-6" />
        {/* Display the title text */}
        <Text
          className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}
        >
          {title}
        </Text>
      </View>

      {/* Conditionally render the right arrow icon */}
      {showArrow && <Image source={icons.rightArrow} className="size-5" />}
    </TouchableOpacity>
  );
};

export default SettingsItem;
