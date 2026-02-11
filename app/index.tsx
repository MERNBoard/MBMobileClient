import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashPage() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)");
    }, 2000);
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <ActivityIndicator size="small" color="#452f82" />
        <Text style={{ marginTop: 20 }}>Carregando...</Text>
      </View>
    </>
  );
}
