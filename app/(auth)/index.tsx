import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password: password,
      });

      // 2. Pegar o token e os dados do usuário (ajuste conforme o que a API do seu amigo envia)
      // Se a API dele enviar 'user', pegamos aqui. Ex: { accessToken, user }
      const { accessToken, user } = response.data;

      // 3. Salvar o token
      await AsyncStorage.setItem("@MBToken", accessToken);

      // 3.1 Salvar os dados do usuário para usar no 'Details'
      // Se a API não retornar o objeto 'user', podemos salvar o email que o usuário digitou
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        // Fallback: se a API não retornar o nome, salvamos pelo menos o email
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ name: "Usuário", email: email }),
        );
      }

      router.replace("/(dashboard)");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Erro ao conectar com o servidor.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "85%", maxWidth: 400 }}>
        <Text style={styles.title}>Entrar</Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.subtitle}>Ainda não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

        <View style={styles.line} />

        <View>
          <Text style={styles.text}>E-mail:</Text>
          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <Text style={styles.text}>Senha:</Text>
          <TextInput
            placeholder="Digite sua senha"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholderTextColor="#999"
          />
        </View>

        <View style={{ marginTop: 10 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar no Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ... seus estilos continuam os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#21155d",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 100,
    marginBottom: 10,
  },
  text: { color: "#f2e7fe", marginBottom: 5, fontSize: 14 },
  subtitle: {
    color: "#f2e7fe",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#bebdda",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  loginButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
