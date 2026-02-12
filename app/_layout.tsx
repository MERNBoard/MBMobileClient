import {
  DefaultTheme,
  ThemeProvider as NavigationProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppContent() {
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const syncNativeBars = async () => {
      if (Platform.OS === "android") {
        try {
          await NavigationBar.setBackgroundColorAsync(theme.background);
          await NavigationBar.setButtonStyleAsync(
            isDarkMode ? "light" : "dark",
          );
        } catch (e) {
          console.warn(e);
        }
      }
    };

    syncNativeBars();
  }, [theme, isDarkMode]);

  const CustomNavTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
      card: theme.primary,
      text: theme.textLight,
      border: theme.secondary,
    },
  };

  return (
    <NavigationProvider value={CustomNavTheme}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </NavigationProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
