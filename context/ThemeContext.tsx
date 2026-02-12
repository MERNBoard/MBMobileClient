import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Colors } from "../constants/theme";

/**
 * Definições de Tipos:
 * ThemeType: Extrai as chaves disponíveis no objeto Colors (ex: 'roxo', 'dark', 'esmeralda').
 * GraficoType: União de strings que define os modelos de visualização suportados.
 */
type ThemeType = keyof typeof Colors;

type GraficoType =
  | "pizza_donut"
  | "pizza_solid"
  | "barra_vertical"
  | "barra_lateral"
  | "linhas"
  | "area";

/**
 * Interface ThemeContextData:
 * Define o formato do objeto compartilhado por toda a aplicação via Context API.
 */
interface ThemeContextData {
  theme: typeof Colors.roxo; // Objeto de cores do tema atual
  themeName: ThemeType; // Nome identificador do tema
  setTheme: (name: ThemeType) => void;
  isDarkMode: boolean; // Flag utilitária para verificações rápidas de modo escuro
  tipoGrafico: GraficoType; // Preferência de visualização do usuário
  setTipoGrafico: (tipo: GraficoType) => void;
}

// Inicialização do contexto com um objeto vazio tipado
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

/**
 * ThemeProvider: Componente wrapper que gerencia o estado global de aparência.
 * Ele lida com a hidratação do estado (carregamento do disco) e a propagação das cores.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>("roxo");
  const [tipoGrafico, setTipoGrafico] = useState<GraficoType>("pizza_donut");
  const [isLoaded, setIsLoaded] = useState(false); // Garante que o app só renderize após carregar as preferências

  /**
   * useEffect de Inicialização:
   * Recupera as preferências salvas no AsyncStorage ao abrir o aplicativo.
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Recuperação do Tema
        const savedTheme = await AsyncStorage.getItem("@app_theme");
        if (savedTheme && savedTheme in Colors) {
          setThemeName(savedTheme as ThemeType);
        }

        // Recuperação do Tipo de Gráfico
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

  /**
   * changeTheme: Atualiza o estado em memória e persiste a escolha no dispositivo.
   */
  const changeTheme = async (name: ThemeType) => {
    setThemeName(name);
    await AsyncStorage.setItem("@app_theme", name);
  };

  /**
   * changeChartType: Atualiza a preferência de gráfico e persiste no AsyncStorage.
   */
  const changeChartType = async (tipo: GraficoType) => {
    setTipoGrafico(tipo);
    await AsyncStorage.setItem("@app_chart_type", tipo);
  };

  // Tela de bloqueio (Splash simples) enquanto os dados estão sendo recuperados do armazenamento
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

/**
 * useTheme: Hook customizado para facilitar o acesso ao contexto
 * sem a necessidade de importar o useContext e o ThemeContext em cada arquivo.
 */
export const useTheme = () => useContext(ThemeContext);
