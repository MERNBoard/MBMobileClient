import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validações básicas
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // 2. Chamada para a rota de registro da documentação
      await api.post("/auth/registrar", {
        nome: nome,
        email: email.toLowerCase().trim(),
        password: password,
      });

      // 3. Sucesso!
      Alert.alert("Sucesso!", "Conta criada. Agora faça login para acessar.", [
        { text: "OK", onPress: () => router.replace("/(auth)") },
      ]);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Erro ao criar conta.";
      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "85%", maxWidth: 400 }}>
        <Text style={styles.title}>Registrar-se</Text>

        <TouchableOpacity onPress={() => router.push("/(auth)")}>
          <Text style={styles.subtitle}>Já tem conta? Faça login</Text>
        </TouchableOpacity>

        <View style={styles.line} />

        <View>
          <Text style={styles.text}>Nome Completo:</Text>
          <TextInput
            placeholder="Digite seu nome completo"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#999"
          />

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

          <Text style={styles.text}>Sua senha:</Text>
          <TextInput
            placeholder="No mínimo 6 caracteres"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <Text style={styles.text}>Confirme sua senha:</Text>
          <TextInput
            placeholder="Repita a senha digitada"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <View style={{ marginTop: 10 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Criar minha conta</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

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
    marginTop: 60,
    marginBottom: 10,
  },
  text: {
    color: "#f2e7fe",
    marginBottom: 5,
    fontSize: 14,
  },
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
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  registerButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
