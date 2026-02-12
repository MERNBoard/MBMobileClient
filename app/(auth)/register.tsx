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
 * Componente de Página de Registro (Cadastro).
 * * Este componente gerencia a criação de novas contas de usuário.
 * Possui validações de formulário local, tratamento de erros de rede/servidor
 * e integração com o sistema de temas do aplicativo.
 */
export default function RegisterPage() {
  // Acessa o contexto de tema atual e o nome do tema (ex: 'dark', 'esmeralda')
  const { theme, themeName } = useTheme();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /** @state loading - Controla o estado de submissão do formulário para exibir o feedback visual */
  const [loading, setLoading] = useState(false);

  /** @state alertVisible - Controla a visibilidade do modal de alerta customizado */
  const [alertVisible, setAlertVisible] = useState(false);

  /** @state alertConfig - Armazena a configuração atual do alerta (texto e ações) */
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "default" as "default" | "danger",
    onConfirm: () => setAlertVisible(false),
  });

  /**
   * Função utilitária para configurar e exibir o alerta customizado.
   * * @param title - O título do alerta.
   * @param message - O texto informativo do corpo.
   * @param type - Define a cor/estilo ('default' ou 'danger').
   * @param action - Função opcional a ser disparada ao confirmar o alerta.
   */
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

  /**
   * Executa a lógica de cadastro do usuário.
   * * Passo a passo:
   * 1. Verifica se todos os campos estão preenchidos.
   * 2. Valida o formato do e-mail via Regex.
   * 3. Verifica se a senha e a confirmação são idênticas.
   * 4. Envia os dados para o endpoint '/auth/registrar'.
   * 5. Em caso de sucesso, redireciona para a tela de login.
   */
  const handleRegister = async () => {
    // Validação de campos obrigatórios
    if (!nome.trim() || !email.trim() || !password || !confirmPassword) {
      showAlert(
        "Campos Vazios",
        "Preencha todos os campos obrigatórios.",
        "danger",
      );
      return;
    }

    // Validação de formato de e-mail
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      showAlert(
        "E-mail Inválido",
        "O formato do e-mail digitado não é válido.",
        "danger",
      );
      return;
    }

    // Validação de igualdade de senhas
    if (password !== confirmPassword) {
      showAlert("Senhas Diferentes", "As senhas não coincidem.", "danger");
      return;
    }

    setLoading(true);
    try {
      // Chamada para a API
      await api.post("/auth/registrar", {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      });

      // Feedback de sucesso com redirecionamento
      showAlert(
        "Sucesso!",
        "Conta criada com sucesso. Agora faça login para acessar.",
        "default",
        () => {
          setAlertVisible(false);
          router.replace("/(auth)"); // Volta para a tela de Login
        },
      );
    } catch (error: any) {
      let title = "Erro no Cadastro";
      let message = "Não foi possível criar sua conta agora.";

      // Tratamento de erros vindo da resposta do servidor
      if (error.response) {
        title = "Aviso";
        message =
          error.response.data?.error ||
          error.response.data?.message ||
          "Erro ao processar dados.";
      } else if (error.request) {
        // Tratamento de erros de infraestrutura/conexão
        title = "Falha de Conexão";
        message = "O servidor não respondeu. Verifique sua internet.";
      }

      showAlert(title, message, "danger");
      console.warn("Register Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- REFINAMENTO DE CORES DO TEMA ---
  const isEsmeralda = themeName === "esmeralda";
  const mainTextColor = theme.textLight || "#FFFFFF";

  // Define a cor de destaque baseada no tema atual
  const highlightColor = isEsmeralda ? theme.textPendente : theme.accent;

  // Configurações visuais dos inputs adaptadas ao tema
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

          {/* Link para retornar à tela de Login */}
          <TouchableOpacity onPress={() => router.push("/(auth)")}>
            <Text style={[styles.subtitle, { color: theme.textLight + "CC" }]}>
              Já tem conta?{" "}
              <Text style={[styles.boldUnderline, { color: highlightColor }]}>
                Faça login
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Linha divisória estética */}
          <View style={[styles.line, { backgroundColor: highlightColor }]} />

          <View style={styles.form}>
            {/* Campo Nome */}
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

            {/* Campo E-mail */}
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

            {/* Campo Senha */}
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

            {/* Campo de Confirmação de Senha */}
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

          {/* Área do Botão de Ação ou Loading */}
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

      {/* Modal de Alerta Customizado */}
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
