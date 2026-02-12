import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

/**
 * Interface TextProps
 * Define a estrutura de dados aceita pelos componentes Title e Texto.
 * @param texto - String contendo o conteúdo a ser exibido.
 * @param style - Propriedade opcional para estender ou sobrescrever os estilos padrão (StyleProp).
 */
type TextProps = {
  texto: string;
  style?: StyleProp<TextStyle>;
};

/**
 * Componente Title
 * Utilizado para títulos e cabeçalhos.
 * Possui por padrão um peso de fonte negrito e tamanho de 16px.
 */
export function Title({ texto, style }: TextProps) {
  return <Text style={[styles.titulo, style]}>{texto}</Text>;
}

/**
 * Componente Texto
 * Utilizado para corpo de texto e descrições gerais.
 * Possui por padrão um tamanho de 14px e a cor padrão do sistema.
 */
export function Texto({ texto, style }: TextProps) {
  return <Text style={[styles.texto, style]}>{texto}</Text>;
}

/**
 * Estilização Padrão
 * Define o visual base para ambos os componentes.
 * A cor principal utilizada é a "#60439f".
 */
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
