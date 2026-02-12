import { router } from "expo-router";
import { Button, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import LoginService from "../../servirces/login"


export default function AuthPage() {


  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
      try {
        await LoginService.login(email, password);
  
         Alert.alert("Sucesso", "Usuário logado com sucesso!");
      } catch (error: any) {
        console.log("Erro no login: ", error.message);
        Alert.alert("Erro", error.message);
      }
    };
  

  return (
    <>
      <View
        style={styles.container}
      >
        <View>
          {/* Título e linha decorativa */}
          <Text style={styles.title}>
            Entrar
          </Text>

          {/* Botão para ir para a página de registro */}
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.subtitle}>Ainda não tem conta? Cadastre-se</Text>
          </TouchableOpacity>

          <Text style={styles.line} >________________________________________________</Text>

          {/*campo de email e senha*/}

          <View>
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
          </View>
          {/* Botão para ir para o Dashboard */}
          <View >
            <Button
              title="Login"
              onPress={handleLogin}
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

  text:{
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
