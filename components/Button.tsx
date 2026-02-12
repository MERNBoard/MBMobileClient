import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

type ButtonProps = {
  text: string;
  onPress: () => void;
};

export function ButtonColorido({ text, onPress }: ButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.accent }]}
      onPress={onPress}
    >
      {}
      <Text style={[styles.text, { color: "#FFFFFF" }]}>{text}</Text>
    </TouchableOpacity>
  );
}

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
