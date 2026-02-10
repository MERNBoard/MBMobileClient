import React from "react";
import { Text, StyleSheet} from "react-native";

type TitleProps = {
  texto: string;
};

export function Title({ texto }: TitleProps) {
  return ( 
      <Text style={styles.titulo}>{texto}</Text>
  );
}

export function Texto({ texto }: TitleProps) {
  return ( 
      <Text style={styles.texto}>{texto}</Text>
  );
}










// -------------------------------------------------------- Estilos para os textos

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
