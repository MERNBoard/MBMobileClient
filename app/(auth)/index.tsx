import AsyncStorage from "@react-native-async-storage/async-storage";
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

/**
 * Componente de Página de Autenticação.
 * * Responsável por renderizar o formulário de login, validar credenciais,
 * realizar a comunicação com a API de autenticação e gerenciar a persistência da sessão.
 */
export default function AuthPage() {
  // Hook de tema personalizado para suporte a múltiplos esquemas de cores
  const { theme, themeName } = useTheme();

  // Estados do formulário de login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /** * Estado para controle da persistência de login (Login persistente)
   */
  const [rememberMe, setRememberMe] = useState(true);

  /** * Configurações de estado para o componente de alerta customizado
   */
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "default" as "default" | "danger",
  });

  /**
   * Dispara o alerta customizado na interface.
   * @param title - Título que aparecerá no topo do alerta.
   * @param message - Mensagem detalhada do erro ou aviso.
   * @param type - Estilo visual do alerta ('default' ou 'danger').
   */
  const showAlert = (
    title: string,
    message: string,
    type: "default" | "danger" = "default",
  ) => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  /**
   * Processa a tentativa de login do usuário.
   * * Realiza validações de campo vazio e formato de e-mail antes de enviar para a API.
   * Em caso de sucesso, armazena o token e redireciona para o dashboard.
   */
  const handleLogin = async () => {
    // Validação de preenchimento básico
    if (!email.trim() || !password) {
      showAlert(
        "Campos Vazios",
        "Por favor, preencha seu e-mail e senha.",
        "danger",
      );
      return;
    }

    // Validação de formato de e-mail via Expressão Regular
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      showAlert(
        "E-mail Inválido",
        "O formato do e-mail digitado não é válido.",
        "danger",
      );
      return;
    }

    setLoading(true);
    try {
      // Chamada à API de autenticação
      const response = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password: password,
      });

      const { accessToken, user } = response.data;

      // Configura o token para todas as futuras requisições desta sessão
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      // Gerenciamento de persistência local (AsyncStorage)
      if (rememberMe) {
        await AsyncStorage.setItem("@MBToken", accessToken);
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          // Fallback caso o objeto user não venha completo na resposta
          await AsyncStorage.setItem(
            "user",
            JSON.stringify({ name: "Usuário", email: email }),
          );
        }
      } else {
        // Limpa dados caso o usuário não queira ser lembrado
        await AsyncStorage.removeItem("@MBToken");
        await AsyncStorage.removeItem("user");
      }

      // Navegação para a área logada do aplicativo
      router.replace("/(dashboard)");
    } catch (error: any) {
      let title = "Erro no Login";
      let message = "Verifique sua conexão e tente novamente.";

      // Tratamento específico para erros retornados pelo servidor
      if (error.response) {
        title = "Acesso Negado";
        message =
          error.response.data?.error ||
          error.response.data?.message ||
          "E-mail ou senha incorretos.";
      } else if (error.request) {
        // Erro de falta de resposta (problemas de rede)
        title = "Falha na Rede";
        message = "Não conseguimos contato com o servidor.";
      }

      showAlert(title, message, "danger");
      console.warn("Auth Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- REFINAMENTO DINÂMICO DE CORES (THEMING) ---
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={[styles.title, { color: highlightColor }]}>Entrar</Text>

          {/* Link para navegação de Cadastro */}
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={[styles.subtitle, { color: theme.textLight + "CC" }]}>
              Ainda não tem conta?{" "}
              <Text style={[styles.boldUnderline, { color: highlightColor }]}>
                Cadastre-se
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={[styles.line, { backgroundColor: highlightColor }]} />

          <View style={styles.form}>
            {/* Campo de Entrada: E-mail */}
            <Text style={[styles.label, { color: highlightColor }]}>
              E-mail:
            </Text>
            <TextInput
              placeholder="Digite seu email"
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

            {/* Campo de Entrada: Senha */}
            <Text style={[styles.label, { color: highlightColor }]}>
              Senha:
            </Text>
            <TextInput
              placeholder="Digite sua senha"
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
              secureTextEntry={true}
              placeholderTextColor="#777"
            />

            {/* Toggle de "Manter Conectado" */}
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: highlightColor,
                    backgroundColor: rememberMe
                      ? highlightColor
                      : "transparent",
                  },
                ]}
              >
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.rememberText, { color: theme.textLight }]}>
                Manter conectado
              </Text>
            </TouchableOpacity>
          </View>

          {/* Área de Ação: Botão de Login ou Indicador de Carregamento */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.accent} />
            ) : (
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: theme.accent }]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>ENTRAR NO DASHBOARD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Componente de Alerta Modal */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => setAlertVisible(false)}
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
  subtitle: { fontSize: 14, marginBottom: 25 },
  boldUnderline: { fontWeight: "bold", textDecorationLine: "underline" },
  line: { width: 60, height: 6, borderRadius: 3, marginBottom: 40 },
  form: { width: "100%" },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1.2,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkmark: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  rememberText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: { marginTop: 20, width: "100%" },
  loginButton: {
    width: "100%",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
