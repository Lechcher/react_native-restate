// Global stylesheet for the app (e.g., utility classes)
import "./global.css";

// Router primitives: `Stack` drives navigation; `SplashScreen` controls app splash
import { SplashScreen, Stack } from "expo-router";

// App-wide context provider (auth/session, user data, etc.)
import GlobalProvider from "@/core/global-provider";
import { useEffect } from "react";
// Load custom fonts before rendering UI to avoid layout shifts/FOUT
import { useFonts } from "expo-font";

// Keep the native splash screen visible until we explicitly hide it
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Preload Rubik font weights from local assets
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Fonts are ready — hide splash and allow UI to render
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // While fonts load, render nothing; splash screen remains visible
    return null;
  }

  return (
    <GlobalProvider>
      {/* Provide global state to all screens and hide default headers */}
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalProvider>
  );
}
