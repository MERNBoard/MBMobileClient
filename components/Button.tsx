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
 * Utilizado para a ação principal da tela (ex: "Entrar", "Salvar", "Confirmar").
 * Possui preenchimento sólido com a cor de destaque (accent).
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
 * Utilizado para ações alternativas ou de cancelamento (ex: "Voltar", "Cancelar", "Limpar").
 * Possui fundo transparente e bordas na cor de destaque.
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
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },

  buttonTransparente: {
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1.5,
  },

  text: {
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
