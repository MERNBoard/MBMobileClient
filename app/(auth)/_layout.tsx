import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext";

/**
 * Componente de Layout para o grupo de autenticação.
 * * Este componente atua como um wrapper para as telas de login e registro,
 * configurando globalmente a StatusBar e as transições de tela do Expo Router
 * com base no tema ativo (Dark, Light, Esmeralda, etc).
 */
export default function Layout() {
  // Acessa as configurações de tema e o nome do tema atual do contexto global
  const { theme, themeName } = useTheme();

  /** * @constant backgroundColor - Define a cor de fundo padrão para as telas de auth.
   * Fallback para preto (#000) caso o tema não esteja definido.
   */
  const backgroundColor = theme?.background || "#000";

  /** * @constant barStyle - Determina dinamicamente a cor dos ícones da StatusBar (relógio, bateria, etc).
   * Se o tema for 'dark' ou o fundo for estritamente preto, usa ícones claros.
   * Caso contrário, usa ícones escuros.
   */
  const barStyle =
    themeName === "dark" || backgroundColor === "#000"
      ? "light-content"
      : "dark-content";

  return (
    <>
      {/* Configuração da Barra de Status do Sistema.
        - translucent={false}: Garante que a barra ocupe seu próprio espaço no topo.
      */}
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent={false}
      />

      {/* Gerenciador de Pilha de Navegação (Stack).
        - headerShown: false -> Remove o cabeçalho padrão do sistema.
        - animation: "fade" -> Define uma transição suave de opacidade entre Login e Registro.
        - contentStyle -> Aplica a cor do tema ao fundo de todas as telas filhas.
      */}
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
