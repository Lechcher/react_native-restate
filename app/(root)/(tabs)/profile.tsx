import { Redirect } from "expo-router";
import {
	Alert,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsItem from "@/components/SettingsItem";
import Separator from "@/components/ui/Separator";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import { logout } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";

const Profile = () => {
	const { refetch, user, loading, isLoggedIn } = useGlobalContext();

	if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

	const handerLogout = async () => {
		const result = await logout();

		if (result) {
			Alert.alert("Logout Successful", "You have been logged out.");
			await refetch({});
		} else {
			Alert.alert("Logout Failed", "Unable to logout. Please try again.");
		}
	};

	return (
		<SafeAreaView className="h-full bg-white">
			<View className="flex flex-row items-center justify-between px-7">
				<Text className="text-xl font-rubik-bold">Profile</Text>
				<Image source={icons.bell} className="size-5" />
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerClassName="px-7"
			>
				<View className="flex-row justify-center flex">
					<View className="flex flex-col items-center relative mt-5">
						<Image
							source={{ uri: user?.avatar }}
							className="size-44 relative rounded-full"
						/>

						<TouchableOpacity className="absolute right-5 bottom-10">
							<Image source={icons.edit} className="size-9"></Image>
						</TouchableOpacity>

						<Text className="text-2xl font-rubik-bold mt-2">
							Lechcher Archson
						</Text>
					</View>
				</View>

				<View className="flex flex-col mt-5">
					<Separator />
					<SettingsItem icon={icons.calendar} title="My Bookings" />
					<SettingsItem icon={icons.wallet} title="Payments" />
					<Separator />
				</View>

				<View className="flex flex-col">
					{settings.slice(2).map((item) => (
						<SettingsItem key={item.title} {...item} />
					))}
				</View>

				<View className="flex flex-col">
					<SettingsItem
						icon={icons.logout}
						title="Logout"
						textStyle="text-danger"
						showArrow={false}
						onPress={handerLogout}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Profile;
