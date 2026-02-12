import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type TextProps = {
  texto: string;
  style?: StyleProp<TextStyle>; // Isso permite passar estilos como { color: theme.textPendente }
};

export function Title({ texto, style }: TextProps) {
  return <Text style={[styles.titulo, style]}>{texto}</Text>;
}

export function Texto({ texto, style }: TextProps) {
  return <Text style={[styles.texto, style]}>{texto}</Text>;
}

const styles = StyleSheet.create({
  titulo: {
    color: "#60439f",
    fontSize: 16,
    fontWeight: "bold",
  },
  texto: {
    color: "#60439f",
    fontSize: 14,
  },
});
