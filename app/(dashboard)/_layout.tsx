import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

// O componente Tabs é usado para criar uma barra de navegação inferior (tab bar) com várias telas.
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#bb86fc", // ícone ativo
        tabBarInactiveTintColor: "#f2e7fe", // ícone inativo

      }}
    >

//
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard",
          headerStyle: {
                backgroundColor: colorScheme === "dark" ? "#21155d" : "#f2e7fe", // fundo do header
              },
          headerTintColor: colorScheme === "dark" ? "#f2e7fe" : "#21155d", // cor do texto e ícones

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
