import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

/**
 * Interface de Propriedades do CustomAlert.
 * Oferece flexibilidade para mensagens informativas ou de perigo.
 */
interface CustomAlertProps {
  visible: boolean; // Controla a visibilidade do Modal
  title: string; // Título em destaque
  message: string; // Texto descritivo do alerta
  onConfirm: () => void; // Ação ao clicar no botão principal
  onCancel: () => void; // Ação ao clicar no botão de cancelamento
  confirmText?: string; // Texto do botão de confirmação (Default: "Confirmar")
  cancelText?: string; // Texto do botão de cancelamento (Default: "Cancelar")
  type?: "default" | "danger"; // Define se o botão principal será Accent ou Vermelho
}

export default function CustomAlert({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "default",
}: CustomAlertProps) {
  const { theme } = useTheme();

  return (
    /**
     * Modal: Utiliza animação 'fade' e transparência para o efeito de overlay.
     */
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Card do Alerta: Fundo utiliza a cor primária do tema atual */}
        <View style={[styles.content, { backgroundColor: theme.primary }]}>
          <Text style={[styles.title, { color: theme.textLight }]}>
            {title}
          </Text>

          <Text
            style={[styles.message, { color: theme.textLight, opacity: 0.7 }]}
          >
            {message}
          </Text>

          <View style={styles.buttons}>
            {/* Botão Secundário: Geralmente usado para Cancelar/Voltar */}
            <TouchableOpacity
              style={[
                styles.btnSecondary,
                { backgroundColor: theme.secondary },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[styles.btnTextSecondary, { color: theme.textLight }]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Botão Principal: Reage ao 'type' para ações destrutivas */}
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                { backgroundColor: theme.accent },
                type === "danger" && { backgroundColor: "#FF3B30" },
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.btnTextPrimary, { color: theme.background }]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  content: {
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  btnTextPrimary: { fontWeight: "bold", fontSize: 15 },
  btnTextSecondary: { fontWeight: "600", fontSize: 15, opacity: 0.9 },
});
