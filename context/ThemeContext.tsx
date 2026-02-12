import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Colors } from "../constants/theme"; // Importa o estoque de cores que criamos

// Definimos quais são os nomes dos temas disponíveis
type ThemeType = keyof typeof Colors;

// Criamos a estrutura do que o contexto vai "entregar" para o app
interface ThemeContextData {
  theme: typeof Colors.roxo;
  themeName: ThemeType;
  setTheme: (name: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>("roxo");

  // Carrega o tema salvo quando o app abre
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("@app_theme");
      if (savedTheme && savedTheme in Colors) {
        setThemeName(savedTheme as ThemeType);
      }
    };
    loadTheme();
  }, []);

  // Função para mudar o tema e salvar a escolha do usuário
  const changeTheme = async (name: ThemeType) => {
    setThemeName(name);
    await AsyncStorage.setItem("@app_theme", name);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: Colors[themeName],
        themeName,
        setTheme: changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nas telas
export const useTheme = () => useContext(ThemeContext);
