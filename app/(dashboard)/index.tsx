import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonColorido, ButtonTransparente } from "@/components/Button";
import { Title,Texto } from "@/components/Text";
import { Header, Body, Baseboard } from "@/components/Layout";
import { GraficoPizza } from "@/components/GraficoPizza";

export default function Index() {
  return (


    <View style={styles.container}>

      {/* Container para os três cabeçalhos lado a lado */}

      <View style={styles.headersRow}>

        <Header 
        componente01={<Title texto="A fazer" />} 
        componente02={<Texto texto="3" />}
        />

        <Header 
        componente01={<Title texto="Em andamento" />} 
        componente02={<Texto texto="2" />}
        />

        <Header 
        componente01={<Title texto="Concluído" />} 
        componente02={<Texto texto="5" />}
        />

      </View>

      <Body
        componente01={<GraficoPizza />}
        componente02={<ButtonTransparente text="Atualizar" onPress={() => {}} />}
      />
      
    </View>
  );
}



// -------------------------------------------------------- Estilos para a página
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, // espaçamento interno
    backgroundColor: "#f2e7fe", // cor de fundo

  },
  headersRow: {
    justifyContent: "space-between", // espaço entre os cabeçalhos
    gap: 10, // espaço entre os Headers
    marginBottom: 10, // separa do Body

    flexDirection: "column",      // alinha os cabeçalhos verticalmente
  },
});