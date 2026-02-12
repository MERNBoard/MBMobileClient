import Octicons from "@expo/vector-icons/Octicons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";

/**
 * DashboardLayout - O Layout de navegação principal.
 * Este componente envolve todas as rotas protegidas e fornece o Menu Lateral (Drawer).
 */
export default function DashboardLayout() {
  const { theme } = useTheme();

  return (
    /**
     * GestureHandlerRootView: Obrigatório para que os gestos de deslizar
     * do Drawer funcionem corretamente tanto no Android quanto no iOS.
     */
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true, // Garante que a barra superior apareça em todas as telas
          headerStyle: {
            backgroundColor: theme.background, // Cor de fundo do header dinâmica
          },
          headerTintColor: theme.textLight, // Cor do título e ícone "hambúrguer"
          drawerActiveTintColor: theme.accent, // Cor do item selecionado no menu
          drawerStyle: {
            backgroundColor: theme.background, // Cor de fundo do menu lateral
          },
          drawerLabelStyle: {
            color: theme.textLight, // Cor dos textos das opções no menu
          },
        }}
      >
        {/* Rota: Início (Dashboard Principal) */}
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

        {/* Rota: (records) - Grupo de telas de tarefas (lista, add, edit, detalhes) */}
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

        {/* Rota: settings/index - Tela de Ajustes e Personalização */}
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
