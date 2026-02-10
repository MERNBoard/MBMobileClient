import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Octicons size={size} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(records)"
        options={{
          headerShown: false,
          title: "Registros",
          tabBarIcon: ({ color, size }) => (
            <Octicons size={size} name="check" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
