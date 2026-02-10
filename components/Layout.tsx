import React from "react";
import { View, Text, StyleSheet } from "react-native";

/* ===== Tipos ===== */

type TwoComponentsProps = {
  componente01?: React.ReactNode;
  componente02?: React.ReactNode;
};

type FourComponentsProps = {
  componente01?: React.ReactNode;
  componente02?: React.ReactNode;
  componente03?: React.ReactNode;
  componente04?: React.ReactNode;
};

/* ===== Cabeçalho ===== */
export function Header({
  componente01,
  componente02,
}: TwoComponentsProps) {
  return (
    <View style={styles.header}>
      {componente01}
      {componente02}
    </View>
  );
}

/* ===== Corpo ===== */
export function Body({
  componente01,
  componente02,
}: TwoComponentsProps) {
  return (
    <View style={styles.body}>

      {componente01}
      {componente02}
    </View>
  );
}

/* ===== Rodapé ===== */
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











/* ===== Estilos ===== */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Alinha os componentes horizontalmente
    justifyContent: "space-between", // Espaço entre os componentes
    alignItems: "center",// Alinha os componentes verticalmente

    backgroundColor: "#ffffff",
    padding: 20, // marginBottom: 20,
  },

  body: {
    flex: 1,
    backgroundColor: "#f2e7fe",
    padding: 20,
  },

  baseboard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    height: 110,
    backgroundColor: "#ffffff",
    padding: 20,
  },

  text: {
    color: "#fff2e7fe",
    fontSize: 40,
    fontWeight: "bold",
  },
});
