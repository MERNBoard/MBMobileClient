import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function AuthPage() {
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
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            Tela de Autenticação
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button
              title="Dashboard"
              onPress={() => router.push("/(dashboard)")}
            />
          </View>
        </View>
      </View>
    </>
  );
}
