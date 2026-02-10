import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtonProps = {
  text: string;
  onPress: () => void;
};

export function ButtonColorido({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

export function ButtonTransparente({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      style={styles.buttonTransparente}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

// -------------------------------------------------------- Estilos para os botões

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#bb86fc",
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
    borderWidth: 1,
    borderColor: "#bb86fc",
  },

  text: {
    color: "#60439f",
    fontSize: 11,
    fontWeight: "bold",
  },
});
