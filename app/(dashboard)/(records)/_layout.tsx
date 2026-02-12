import { Stack } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.accent,
        headerTitleStyle: {
          fontWeight: "bold",
          color: theme.textLight,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          title: "Nova Tarefa",
          headerBackTitle: "Voltar",
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          headerShown: true,
          title: "Editar Tarefa",
          headerBackTitle: "Voltar",
        }}
      />

      <Stack.Screen
        name="details"
        options={{
          headerShown: true,
          title: "Detalhes",
        }}
      />
    </Stack>
  );
}
