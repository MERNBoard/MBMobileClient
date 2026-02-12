import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Colors } from "../constants/theme";

type ThemeType = keyof typeof Colors;

type GraficoType =
  | "pizza_donut"
  | "pizza_solid"
  | "barra_vertical"
  | "barra_lateral"
  | "linhas"
  | "area";

interface ThemeContextData {
  theme: typeof Colors.roxo;
  themeName: ThemeType;
  setTheme: (name: ThemeType) => void;
  isDarkMode: boolean;
  tipoGrafico: GraficoType;
  setTipoGrafico: (tipo: GraficoType) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>("roxo");
  const [tipoGrafico, setTipoGrafico] = useState<GraficoType>("pizza_donut");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@app_theme");
        if (savedTheme && savedTheme in Colors) {
          setThemeName(savedTheme as ThemeType);
        }

        const savedChart = await AsyncStorage.getItem("@app_chart_type");
        const validCharts = [
          "pizza_donut",
          "pizza_solid",
          "barra_vertical",
          "barra_lateral",
          "linhas",
          "area",
        ];

        if (savedChart && validCharts.includes(savedChart)) {
          setTipoGrafico(savedChart as GraficoType);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações de tema:", error);
      } finally {
        setIsLoaded(true);
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

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

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
