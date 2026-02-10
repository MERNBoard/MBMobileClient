import { Dimensions } from "react-native";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";

import { Stack, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

//função que inicializa o projeto
export default function MenuAcessivel() {

  //espaço para funções, apenas chamalas e NUNCA CRIAER FUNÇÕES AQUI
  const router = useRouter();

  return (

    <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFEE93", // amarelo suave
    justifyContent: "flex-start",
    paddingTop: 80, // quanto maior, mais para baixo; menor, mais para cima
  },


  logo: {
    width: 200,
    height: 120,
    marginTop: 40,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },

  botaoGrande: {
     width: "85%",
    height: 70,
    backgroundColor: "#4F46E5", // azul moderno
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }


});
