import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

/* ===== Tipos ===== */

type TwoComponentsProps = {
  componente01?: React.ReactNode;
  componente02?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type FourComponentsProps = {
  componente01?: React.ReactNode;
  componente02?: React.ReactNode;
  componente03?: React.ReactNode;
  componente04?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/* ===== Cabeçalho (Quadrados do Dashboard) ===== */
export function Header({
  componente01,
  componente02,
  style,
}: TwoComponentsProps) {
  return (
    <View style={[styles.header, style]}>
      {componente01}
      {componente02}
    </View>
  );
}

/* ===== Corpo (Onde fica o Gráfico) ===== */
export function Body({
  componente01,
  componente02,
  style,
}: TwoComponentsProps) {
  return (
    <View style={[styles.body, style]}>
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
  style,
}: FourComponentsProps) {
  return (
    <View style={[styles.baseboard, style]}>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
  },

  body: {
    flex: 1,
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
