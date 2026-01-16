import "../global.css";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { hasApiKey } from "../src/api";
import { RoxyBranding } from "../src/components/RoxyBranding";
import { appColors } from "../src/constants/colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {!hasApiKey() ? (
          <RoxyBranding />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="card/[id]" 
              options={{ 
                presentation: "modal",
                headerShown: true,
                title: "Card Details",
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
                },
                headerTintColor: colorScheme === 'dark' ? appColors.white : appColors.zinc[900],
              }} 
            />
          </Stack>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
