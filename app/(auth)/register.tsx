import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import { router } from "expo-router";
import React from "react";
import { API_AUTH } from "../../servirces/auth"
import { Alert } from "react-native";

export default function RegisterPage() {


  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const handleRegister = async () => {
    try {
      await API_AUTH(name, email, password);

       Alert.alert("Sucesso", "Usuário cadastrado!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          {/* Título e linha decorativa */}
          <Text style={styles.title}>
            Registrar-se
          </Text>

          {/* Botão para ir para a página de registro */}
          <TouchableOpacity onPress={() => router.push("/(auth)")}>
            <Text style={styles.subtitle}>Já tem conta? Faça login</Text>
          </TouchableOpacity>

          <Text style={styles.line} >________________________________________________</Text>

          {/*campo de email e senha*/}

          <View>

            <Text style={styles.text}>Nome Completo:</Text>
            <TextInput
              placeholder="Digite seu nome completo" onChangeText={setName}
              style={styles.input}
            />

            <Text style={styles.text}>email:</Text>
            <TextInput
              placeholder="Digite seu email" onChangeText={setEmail}
              style={styles.input}
            />

            <Text style={styles.text}>Insira sua senha :</Text>
            <TextInput
              placeholder="Digite sua senha" onChangeText={setPassword}
              style={styles.input}
            />

            <Text style={styles.text}>Insira sua senha :</Text>
            <TextInput
              placeholder="Comfirme sua senha" onChangeText={setConfirmPassword}
              style={styles.input}
            />

          </View>
          {/* Botão para ir para o Dashboard */}
          <View >
            <Button
              title="Registrar"
              onPress={handleRegister}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#21155d",
    alignItems: "center",         // centraliza na horizontal
    paddingTop: 40,
    height: "100%", // garante que o container ocupe toda a altura
    width: "100%", // garante que o container ocupe toda a largura

  },


  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 120,    // espaço entre o topo e o título
    marginBottom: 10,   // espaço entre o título e a linha

  },

  text: {
    color: "#f2e7fe",
  },

  subtitle: {
    color: "#f2e7fe",
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
  },

  line: {
    width: "80%",       // tamanho da linha
    height: 1,          // espessura
    backgroundColor: "#bebdda", // cor roxinha (ajusta se quiser)
    marginTop: 10,
    marginBottom: 20,   // espaço depois da linha
    alignItems: "center",

  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,   // espaço 
    alignItems: "center",

  },

});
