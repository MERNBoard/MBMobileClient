import React from "react";
/**
 * DOCUMENTAÇÃO DOS IMPORTS:
 * Modal: Cria a sobreposição (overlay) sobre a interface.
 * StyleSheet: Define os estilos de forma otimizada.
 * Text/View: Componentes básicos de estrutura e texto.
 * TouchableOpacity: Botão interativo com feedback visual.
 */
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CustomAlertProps {
  visible: boolean; // Define se o modal está ativo.
  title: string; // Título principal do alerta.
  message: string; // Descrição do alerta.
  onConfirm: () => void; // Ação ao clicar no botão de confirmação.
  onCancel: () => void; // Ação ao clicar no botão de cancelar.
  confirmText?: string; // Texto customizado para confirmar (opcional).
  cancelText?: string; // Texto customizado para cancelar (opcional).
  type?: "default" | "danger"; // Define a cor do botão (Preto ou Vermelho).
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
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            {/* Botão Secundário - Estilo Neutro */}
            <TouchableOpacity style={styles.btnSecondary} onPress={onCancel}>
              <Text style={styles.btnTextSecondary}>{cancelText}</Text>
            </TouchableOpacity>

            {/* Botão Primário - Dinâmico (Muda cor se for 'danger') */}
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                type === "danger" && { backgroundColor: "#FF3B30" },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.btnTextPrimary}>{confirmText}</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  content: {
    backgroundColor: "#fff",
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
    color: "#1a1a1a",
  },
  message: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    minWidth: 100,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    minWidth: 100,
  },
  btnTextPrimary: { color: "#fff", fontWeight: "600", fontSize: 15 },
  btnTextSecondary: { color: "#666", fontWeight: "600", fontSize: 15 },
});
