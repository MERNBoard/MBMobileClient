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
          // Garante que a barra seja visível e não translúcida
          await NavigationBar.setVisibilityAsync("visible");
          await NavigationBar.setPositionAsync("relative");

          // Aplica a cor do seu tema
          await NavigationBar.setBackgroundColorAsync(theme.background);

          // Ajusta a cor dos ícones (voltar/home)
          await NavigationBar.setButtonStyleAsync(
            isDarkMode ? "light" : "dark",
          );
        } catch (e) {
          console.warn("Erro na NavigationBar:", e);
        }
      }
    };

    syncNativeBars();
  }, [theme.background, isDarkMode]);

  const CustomNavTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme?.background || "#000",
      card: theme?.primary || "#121212",
      text: theme?.textLight || "#fff",
      border: theme?.secondary || "#333",
      primary: theme?.accent || "#6200ee",
    },
  };

  return (
    <NavigationProvider value={CustomNavTheme}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          style={isDarkMode ? "light" : "dark"}
          backgroundColor={theme.background}
          translucent={false}
        />

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
