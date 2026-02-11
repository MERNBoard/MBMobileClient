import React from "react";
import { View, Text, StyleSheet } from "react-native";

// ------------------------------------------- Tipos para os componentes do Layout

type FourComponentsProps = {
  componente01?: React.ReactNode;
  componente02?: React.ReactNode;
  componente03?: React.ReactNode;
  componente04?: React.ReactNode;
};

// -------------------------------------------------------- Cabeçalho
export function Header({
  componente01,
  componente02,
  componente03,
  componente04,
}: FourComponentsProps) {
  return (
    <View style={styles.header}>

      {componente01}
      {componente02}
      {componente03}
      {componente04}

    </View>
  );
}

// -------------------------------------------------------- Corpo
export function Body({
  componente01,
  componente02,
  componente03,
  componente04,
}: FourComponentsProps) {
  return (
    <View style={styles.body}>

      {componente01}
      {componente02}
      {componente03}
      {componente04}

    </View>
  );
}

// -------------------------------------------------------- Rodapé
export function Baseboard({
  componente01,
  componente02,
  componente03,
  componente04,
}: FourComponentsProps) {
  return (
    <View style={styles.baseboard}>

      {componente01}
      {componente02}
      {componente03}
      {componente04}

    </View>
  );
}










// -------------------------------------------------------- Estilos para os componentes do Layout

const styles = StyleSheet.create({

// -------------------------------------------------------- Estilo para o cabeçalho
  header: {
    flexDirection: "row", // organiza os itens em linha
    justifyContent: "space-between", // espaça os itens igualmente
    alignItems: "center", // alinha os itens ao centro verticalmente
    backgroundColor: "#ffffff",
    padding: 20,// espaçamento interno
    borderRadius: 15, // borda arredondada
  },

// -------------------------------------------------------- Estilo para o corpo
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,// espaçamento interno
    borderRadius: 15, // borda arredondada
  },

// -------------------------------------------------------- Estilo para o rodapé
  baseboard: {
    flexDirection: "row",// organiza os itens em linha
    justifyContent: "space-between",// espaça os itens igualmente
    alignItems: "center",// alinha os itens ao centro verticalmente
    height: 110,// altura fixa
    backgroundColor: "#ffffff",
    padding: 20,// espaçamento interno
    borderRadius: 15, // borda arredondada
  },

// -------------------------------------------------------- Estilo para o texto do rodapé
  text: {
    color: "#fff2e7fe",
    fontSize: 40,// tamanho da fonte
    fontWeight: "bold",// peso da fonte
  },
});