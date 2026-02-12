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

/**
 * AppContent - Componente interno que consome o ThemeContext.
 * Separado do RootLayout para poder acessar o hook useTheme().
 */
function AppContent() {
  const { theme, isDarkMode } = useTheme();

  /**
   * Sincronização Nativa (Android):
   * Ajusta a Navigation Bar inferior do sistema para combinar com as cores do App.
   */
  useEffect(() => {
    const syncNativeBars = async () => {
      if (Platform.OS === "android") {
        try {
          // Garante que a barra seja visível e não translúcida
          await NavigationBar.setVisibilityAsync("visible");
          await NavigationBar.setPositionAsync("relative");

          // Aplica a cor de fundo definida no tema atual
          await NavigationBar.setBackgroundColorAsync(theme.background);

          // Ajusta a cor dos ícones (voltar/home) para contraste (light/dark)
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

  /**
   * CustomNavTheme: Mapeia as cores do seu contexto de tema customizado
   * para o padrão esperado pelo React Navigation nativo.
   */
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
        {/* StatusBar: A barra superior do sistema (relógio, bateria, etc) */}
        <StatusBar
          style={isDarkMode ? "light" : "dark"}
          backgroundColor={theme.background}
          translucent={false}
        />

        {/* Stack Principal: Define os fluxos globais do App */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" /> {/* Splash ou tela de verificação */}
          <Stack.Screen name="(auth)" /> {/* Fluxo de Login/Cadastro */}
          <Stack.Screen
            name="(dashboard)"
            options={{ headerShown: false }}
          />{" "}
          {/* App logado */}
        </Stack>
      </View>
    </NavigationProvider>
  );
}

/**
 * RootLayout: O "avô" de todos os componentes.
 * Envolve a aplicação com o ThemeProvider para que todos os filhos tenham acesso às cores.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
