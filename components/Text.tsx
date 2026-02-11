import React from "react";
import { Text, StyleSheet} from "react-native";

type TitleProps = {
  texto: string;
};

// -------------------------------------------------------- Título
export function Title({ texto }: TitleProps) {
  return ( 
      <Text style={styles.titulo}>{texto}</Text>
  );
}

// -------------------------------------------------------- Texto
export function Texto({ texto }: TitleProps) {
  return ( 
      <Text style={styles.texto}>{texto}</Text>
  );
}










// -------------------------------------------------------- Estilos para os textos
const styles = StyleSheet.create({

// -------------------------------------------------------- Estilo para o título
  titulo: { 
    color: "#60439f",
    fontSize: 16,
    fontWeight: "bold",
  },

// -------------------------------------------------------- Estilo para o texto comum
  texto: {
    color: "#60439f",
    fontSize: 14,
  },
});
