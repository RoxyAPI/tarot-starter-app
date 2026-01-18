import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Star, Library, Sparkles, LayoutGrid, CircleHelp } from "lucide-react-native";
import { appColors } from "../../src/constants/colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.gray[400],
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
          borderTopColor: colorScheme === 'dark' ? appColors.zinc[800] : appColors.gray[200],
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
        },
        headerTintColor: colorScheme === 'dark' ? appColors.white : appColors.zinc[900],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Daily Card",
          tabBarIcon: ({ color }) => <Star color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => <Library color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="draw"
        options={{
          title: "Draw",
          tabBarIcon: ({ color }) => <Sparkles color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="spreads"
        options={{
          title: "Spreads",
          tabBarIcon: ({ color }) => <LayoutGrid color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="yes-no"
        options={{
          title: "Yes/No",
          tabBarIcon: ({ color }) => <CircleHelp color={String(color)} size={24} />,
        }}
      />
    </Tabs>
  );
}
