import { Image, Text, View } from "react-native";

const TabsIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: Icon using any type to use linking path name
  icon: any;
  title: string;
}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#0061FF" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${focused ? "text-primary-300 font-rubik-medium" : "text-blue-200 font-rubik"} text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

export default TabsIcon;
