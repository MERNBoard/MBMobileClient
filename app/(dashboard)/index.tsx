import { ButtonTransparente } from "@/components/Button";
import { Body, Header } from "@/components/Layout";
import { Texto, Title } from "@/components/Text";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Header
        componente01={<Title texto="Minhas Tarefas" />}
        componente02={
          <ButtonTransparente
            text=" + Adicionar Tarefa"
            onPress={() => console.log("Adicionar")}
          />
        }
      />

      <Body
        componente01={<Texto texto="Corpo do Layout" />}
        componente02={<Texto texto="Mais conteúdo aqui" />}
      />
    </View>
  );
}

// -------------------------------------------------------- Estilos para a página

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
