import { Tabs } from "expo-router";
import TabsIcon from "@/components/TabsIcon";
import icons from "@/constants/icons";

// Bottom tab layout for the app using Expo Router.
// Each tab hides its label and uses a custom icon via TabsIcon.

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        // Global options for the tab bar across all tabs
        tabBarShowLabel: false,
        tabBarStyle: {
          borderRightColor: "white", // Visual divider (primarily Android)
          position: "absolute", // Float the tab bar above content
          borderTopColor: "#0061FF1A", // Subtle top border color
          borderTopWidth: 1,
          minHeight: 70, // Taller touch target for better ergonomics
        },
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false, // Each screen manages its own header
          tabBarIcon: ({ focused }) => (
            <TabsIcon icon={icons.home} focused={focused} title="Home" />
          ),
        }}
      />

      {/* Explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabsIcon icon={icons.search} focused={focused} title="Explore" />
          ),
        }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabsIcon icon={icons.person} focused={focused} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
