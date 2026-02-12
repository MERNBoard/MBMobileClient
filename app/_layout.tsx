import {
  DefaultTheme,
  ThemeProvider as NavigationProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    if (NavigationBar.setBackgroundColorAsync) {
      NavigationBar.setBackgroundColorAsync(theme.background);
      const isLight =
        theme.background === "#F5F3FF" || theme.background === "#ffffff";
      NavigationBar.setButtonStyleAsync(isLight ? "dark" : "light");
    }
  }, [theme]);

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
        <StatusBar style={theme.background === "#F5F3FF" ? "dark" : "light"} />

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
