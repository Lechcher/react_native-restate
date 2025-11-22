import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  onPress?: () => void;
}

const FeaturedCard = ({ onPress }: CardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-center w-60 h-80 relative"
    >
      <Image source={images.japan} className="size-full rounded-2xl" />
      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />

        <Text className="text-xs font-rubik-bold text-primary-300 ml-1">
          4.4
        </Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-rubik-extrabold text-white"
          numberOfLines={1}
        >
          Modern Apartment
        </Text>

        <Text className="text-base font-rubik text-white">New York, US</Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-xl font-rubik-extrabold text-white">
            $12,219
          </Text>

          <Image source={icons.heart} className="size-5" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Card = ({ onPress }: CardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-1 px-3 py-4 mt-4 w-full rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
    >
      <View className="flex flex-row items-center bg-white/90 px-2 p-1 rounded-full absolute top-5 right-5 z-50">
        <Image source={icons.star} className="size-2.5" />

        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          4.4
        </Text>
      </View>

      <Image source={images.newYork} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-xl font-rubik-bold text-black-300">
          Modern Apartment
        </Text>

        <Text className="text-xs font-rubik text-black-200">New York, US</Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">
            $12,219
          </Text>

          <Image
            source={icons.heart}
            className="size-5 mr-2"
            tintColor="#191d31"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { Card, FeaturedCard };
