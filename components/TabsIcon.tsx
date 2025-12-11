// Imports for React Native components
import { Image, Text, View } from "react-native";

// TabsIcon functional component definition
const TabsIcon = ({
  focused, // Boolean indicating if the tab is currently focused
  icon, // The icon source for the tab
  title, // The title text for the tab
}: {
  focused: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: Icon using any type to use linking path name
  icon: any; // Using 'any' type for the icon prop to allow various image sources
  title: string;
}) => (
  // Main container for the tab icon and title, styled to be a flex column
  <View className="flex-1 mt-3 flex flex-col items-center">
    {/* Image component for the tab icon */}
    <Image
      source={icon} // Set the icon source
      tintColor={focused ? "#0061FF" : "#666876"} // Dynamically set tint color based on focus state
      resizeMode="contain" // Ensure the icon fits within its bounds
      className="size-6" // Tailwind CSS class for icon size
    />
    {/* Text component for the tab title */}
    <Text
      // Dynamically set text color and font weight based on focus state
      className={`${focused ? "text-primary-300 font-rubik-medium" : "text-blue-200 font-rubik"} text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

export default TabsIcon;
