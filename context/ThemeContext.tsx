import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Colors } from "../constants/theme";

type ThemeType = keyof typeof Colors;
// Definindo os tipos de gráficos permitidos
type GraficoType = "pizza" | "barras" | "linhas" | "area";

interface ThemeContextData {
  theme: typeof Colors.roxo;
  themeName: ThemeType;
  setTheme: (name: ThemeType) => void;
  isDarkMode: boolean;
  // Novos campos adicionados aqui
  tipoGrafico: GraficoType;
  setTipoGrafico: (tipo: GraficoType) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>("roxo");
  const [tipoGrafico, setTipoGrafico] = useState<GraficoType>("pizza");

  useEffect(() => {
    const loadSettings = async () => {
      // Carrega o tema salvo
      const savedTheme = await AsyncStorage.getItem("@app_theme");
      if (savedTheme && savedTheme in Colors) {
        setThemeName(savedTheme as ThemeType);
      }

      // Carrega o tipo de gráfico salvo
      const savedChart = await AsyncStorage.getItem("@app_chart_type");
      if (savedChart) {
        setTipoGrafico(savedChart as GraficoType);
      }
    };
    loadSettings();
  }, []);

  const changeTheme = async (name: ThemeType) => {
    setThemeName(name);
    await AsyncStorage.setItem("@app_theme", name);
  };

  const changeChartType = async (tipo: GraficoType) => {
    setTipoGrafico(tipo);
    await AsyncStorage.setItem("@app_chart_type", tipo);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: Colors[themeName],
        themeName,
        setTheme: changeTheme,
        isDarkMode: themeName === "dark",
        tipoGrafico,
        setTipoGrafico: changeChartType,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
