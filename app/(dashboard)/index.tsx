import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonColorido, ButtonTransparente } from "@/components/Button";
import { Title,Texto } from "@/components/Text";
import { Header, Body, Baseboard } from "@/components/Layout";


export default function Index() {
  return (
    <View style={styles.container}>

      <Header 
      
      componente01={<Title texto="Minhas Tarefas" />}  
      componente02={<ButtonTransparente text=" + Adicionar Tarefa" onPress={() => console.log("Adicionar")}/>}     
      />

      <Body 
      
      componente01={<Texto texto="Corpo do Layout" />} 
      componente02={<Texto texto="Mais conteúdo aqui" />}
      
      />

      <ButtonColorido text="Salvar" onPress={() => console.log("Salvar")} />

    </View>
  );
}

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
