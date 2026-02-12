import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../components/CustomAlert";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

export default function RegisterPage() {
  const { theme, themeName } = useTheme();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "default" as "default" | "danger",
    onConfirm: () => setAlertVisible(false),
  });

  const showAlert = (
    title: string,
    message: string,
    type: "default" | "danger" = "default",
    action?: () => void,
  ) => {
    setAlertConfig({
      title,
      message,
      type,
      onConfirm: action ? action : () => setAlertVisible(false),
    });
    setAlertVisible(true);
  };

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !password || !confirmPassword) {
      showAlert(
        "Campos Vazios",
        "Preencha todos os campos obrigatórios.",
        "danger",
      );
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      showAlert(
        "E-mail Inválido",
        "O formato do e-mail digitado não é válido.",
        "danger",
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Senhas Diferentes", "As senhas não coincidem.", "danger");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/registrar", {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      });

      showAlert(
        "Sucesso!",
        "Conta criada com sucesso. Agora faça login para acessar.",
        "default",
        () => {
          setAlertVisible(false);
          router.replace("/(auth)");
        },
      );
    } catch (error: any) {
      let title = "Erro no Cadastro";
      let message = "Não foi possível criar sua conta agora.";

      if (error.response) {
        title = "Aviso";
        message =
          error.response.data?.error ||
          error.response.data?.message ||
          "Erro ao processar dados.";
      } else if (error.request) {
        title = "Falha de Conexão";
        message = "O servidor não respondeu. Verifique sua internet.";
      }

      showAlert(title, message, "danger");
      console.warn("Register Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEsmeralda = themeName === "esmeralda";
  const mainTextColor = theme.textLight || "#FFFFFF";

  const highlightColor = isEsmeralda ? theme.textPendente : theme.accent;

  const inputBackground =
    theme.input || (themeName === "dark" ? "#1A1A1A" : "#F5F5F7");
  const contrastBorder =
    theme.detail || (themeName === "dark" ? "#333" : "#D0D0D0");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={[styles.title, { color: highlightColor }]}>
            Cadastro
          </Text>

          <TouchableOpacity onPress={() => router.push("/(auth)")}>
            <Text style={[styles.subtitle, { color: theme.textLight + "CC" }]}>
              Já tem conta?{" "}
              <Text style={[styles.boldUnderline, { color: highlightColor }]}>
                Faça login
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={[styles.line, { backgroundColor: highlightColor }]} />

          <View style={styles.form}>
            <Text style={[styles.label, { color: highlightColor }]}>
              Nome Completo:
            </Text>
            <TextInput
              placeholder="Digite seu nome"
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: mainTextColor,
                  borderColor: contrastBorder,
                },
              ]}
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#777"
            />

            <Text style={[styles.label, { color: highlightColor }]}>
              E-mail:
            </Text>
            <TextInput
              placeholder="seu@email.com"
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: mainTextColor,
                  borderColor: contrastBorder,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#777"
            />

            <Text style={[styles.label, { color: highlightColor }]}>
              Sua senha:
            </Text>
            <TextInput
              placeholder="No mínimo 6 caracteres"
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: mainTextColor,
                  borderColor: contrastBorder,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#777"
            />

            <Text style={[styles.label, { color: highlightColor }]}>
              Confirme sua senha:
            </Text>
            <TextInput
              placeholder="Repita a senha"
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: mainTextColor,
                  borderColor: contrastBorder,
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.accent} />
            ) : (
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>CRIAR MINHA CONTA</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
        confirmText="OK"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: { width: "85%", maxWidth: 400 },
  title: {
    fontSize: 42,
    fontWeight: "900",
    textAlign: "left",
    marginBottom: 5,
  },
  subtitle: { fontSize: 14, marginBottom: 20 },
  boldUnderline: { fontWeight: "bold", textDecorationLine: "underline" },
  line: { width: 60, height: 6, borderRadius: 3, marginBottom: 35 },
  form: { width: "100%" },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1.2,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  buttonContainer: { marginTop: 10, width: "100%" },
  registerButton: {
    width: "100%",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
