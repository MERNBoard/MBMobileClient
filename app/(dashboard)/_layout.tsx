import Octicons from "@expo/vector-icons/Octicons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardLayout() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.textLight,
          drawerActiveTintColor: theme.accent,
          drawerStyle: {
            backgroundColor: theme.background,
          },
          drawerLabelStyle: {
            color: theme.textLight,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Início",
            title: "Dashboard",
            drawerIcon: ({ size }) => (
              <Octicons size={size} name="home" color={theme.accent} />
            ),
          }}
        />
        <Drawer.Screen
          name="(records)"
          options={{
            drawerLabel: "Tarefas",
            title: "Minhas Tarefas",
            drawerIcon: ({ size }) => (
              <Octicons size={size} name="checklist" color={theme.accent} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings/index"
          options={{
            drawerLabel: "Configurações",
            title: "Aparência",
            drawerIcon: ({ size }) => (
              <Octicons size={size} name="gear" color={theme.accent} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
