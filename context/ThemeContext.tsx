import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Colors } from "../constants/theme";

type ThemeType = keyof typeof Colors;

interface ThemeContextData {
  theme: typeof Colors.roxo;
  themeName: ThemeType;
  setTheme: (name: ThemeType) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>("roxo");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("@app_theme");
      if (savedTheme && savedTheme in Colors) {
        setThemeName(savedTheme as ThemeType);
      }
    };
    loadTheme();
  }, []);

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
        isDarkMode: themeName === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
