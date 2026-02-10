import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Registros",
        }}
      />

      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          title: "Novo Registro",
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          headerShown: true,
          title: "Editar Registro",
        }}
      />
    </Stack>
  );
}
