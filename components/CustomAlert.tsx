import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "danger";
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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.primary }]}>
          {" "}
          <Text style={[styles.title, { color: theme.textLight }]}>
            {title}
          </Text>{" "}
          <Text
            style={[styles.message, { color: theme.textLight, opacity: 0.7 }]}
          >
            {message}
          </Text>{" "}
          <View style={styles.buttons}>
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
              </Text>{" "}
            </TouchableOpacity>

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
              </Text>{" "}
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
    backgroundColor: "rgba(0,0,0,0.6)", // Mudou: Levemente mais escuro para destacar no dark mode
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
    minWidth: 100,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    minWidth: 100,
  },
  btnTextPrimary: { fontWeight: "600", fontSize: 15 },
  btnTextSecondary: { fontWeight: "600", fontSize: 15, opacity: 0.8 },
});
