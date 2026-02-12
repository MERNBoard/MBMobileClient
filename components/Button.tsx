import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

/**
 * Propriedades compartilhadas por todos os tipos de botão.
 */
type ButtonProps = {
  text: string; // Rótulo do botão (exibido em uppercase)
  onPress: () => void; // Função de callback disparada no clique
};

/**
 * ButtonColorido - Botão Primário.
 * Agora com bordas ultra arredondadas para um design mais orgânico.
 */
export function ButtonColorido({ text, onPress }: ButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.accent }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: "#FFFFFF" }]}>{text}</Text>
    </TouchableOpacity>
  );
}

/**
 * ButtonTransparente - Botão Secundário / Outline.
 * Mantém a transparência, mas segue o novo padrão de arredondamento.
 */
export function ButtonTransparente({ text, onPress }: ButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.buttonTransparente, { borderColor: theme.accent }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: theme.accent }]}>{text}</Text>
    </TouchableOpacity>
  );
}

// -------------------------------------------------------- Estilos

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,

    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonTransparente: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 2,
  },

  text: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
});
