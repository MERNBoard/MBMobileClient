import AsyncStorage from "@react-native-async-storage/async-storage"; // Para armazenar tokens
import api from "./api"; // Se você tiver um axios configurado

const LoginService = {
// Login
  async login(email, password) {

    if (!email || !password) {
      console.log("Campos vazios: ", { email, password });
      throw new Error("Preencha todos os campos");

    }

    try {
      const response = await api.post("/auth/login", { email, password });

      const { accessToken, user } = response.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { accessToken, user };

    } catch (error) {
      console.log("Erro no login: ", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Refresh token não encontrado");

      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.log("Erro ao renovar token: ", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao renovar token");
    }
  },

  // Logout
  async logout() {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  },

  // Pegar token do AsyncStorage
  async getAccessToken() {
    return await AsyncStorage.getItem("accessToken");
  },

};

export default LoginService;