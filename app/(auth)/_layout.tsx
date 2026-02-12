import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Layout() {
  const { theme, themeName } = useTheme();

  const backgroundColor = theme?.background || "#000";
  const barStyle =
    themeName === "dark" || backgroundColor === "#000"
      ? "light-content"
      : "dark-content";

  return (
    <>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent={false}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: backgroundColor },
        }}
      />
    </>
  );
}
