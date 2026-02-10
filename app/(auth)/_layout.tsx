import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <>

      <StatusBar
        backgroundColor="#21155d"  // cor da barra (Android)
        barStyle="light-content"  // ícones brancos
      />

      <Stack
        screenOptions={{
          headerShown: false, // oculta o header para as telas de autenticação
          
        }}
      />

    </>

  );
}
