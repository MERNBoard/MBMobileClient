import AsyncStorage from "@react-native-async-storage/async-storage"; 
import api from "./api"; 

const AuthService = {
  // Registrar usuário com validação de confirmPassword
  async registrar({ nome, email, senha, confirmPassword }) {

    if (!nome || !email || !senha || !confirmPassword) {
      console.log("Campos faltando:", { nome, email, senha, confirmPassword });
      throw new Error("Preencha todos os campos");
    }

    if (!email.includes("@")) {
      console.log("Email inválido:", email);
      throw new Error("Email inválido");
    }

    if (senha !== confirmPassword) {
      console.log("Senhas não coincidem:", { senha, confirmPassword });
      throw new Error("As senhas não coincidem");
    }

    try {
      const response = await api.post("/auth", { nome, email, senha });
      const { accessToken, refreshToken } = response.data;

      // Salva tokens no AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      console.log("Erro no registro: ", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao registrar", error);
    }
  },

  
};

export default AuthService;
