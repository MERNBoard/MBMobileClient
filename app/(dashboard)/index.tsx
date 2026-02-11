import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonColorido, ButtonTransparente } from "@/components/Button";
import { Title,Texto } from "@/components/Text";
import { Header, Body, Baseboard } from "@/components/Layout";

export default function Index() {
  return (


    <View style={styles.container}>

      {/* Container para os três cabeçalhos lado a lado */}

      <View style={styles.headersRow}>

        <Header 
        componente01={<Title texto="Cabeçalho 1" />} 
        />
        <Header 
        componente01={<Title texto="Cabeçalho 2" />} 
        />
        <Header 
        componente01={<Title texto="Cabeçalho 3" />} 
        />

      </View>

      <Body componente01={<Title texto="Visão Geral" />} />
    </View>
  );
}



// -------------------------------------------------------- Estilos para a página
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2e7fe", // cor de fundo

  },
  headersRow: {
    flexDirection: "row", // coloca os filhos lado a lado
    justifyContent: "space-between", // espaço entre os cabeçalhos
    marginBottom: 20, // separa do Body
    
  },
});