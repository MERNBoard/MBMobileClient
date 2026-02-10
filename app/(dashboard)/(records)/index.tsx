import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function RecordsPage() {
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text>Records Page</Text>
        <Button
          title="Tela para adicionar"
          onPress={() => router.push("/(dashboard)/(records)/add")}
        />

        <Button
          title="Tela para editar"
          onPress={() => router.push("/(dashboard)/(records)/edit")}
        />
      </View>
    </>
  );
}
