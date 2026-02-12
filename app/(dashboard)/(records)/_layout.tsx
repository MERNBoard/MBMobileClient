import { Stack } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

/**
 * Componente de Layout de Navegação Interna.
 * * Este arquivo define a estrutura da pilha (Stack) de navegação para as telas
 * de gerenciamento de tarefas (Listagem, Adição, Edição e Detalhes).
 * Ele integra as propriedades do tema global diretamente nas opções de estilo
 * do cabeçalho do Expo Router.
 */
export default function Layout() {
  /** * Extrai o objeto de tema atual para aplicar cores dinâmicas
   * nos componentes de navegação.
   */
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        // Define a cor de fundo do cabeçalho baseada no tema atual
        headerStyle: {
          backgroundColor: theme.background,
        },
        // Define a cor de elementos clicáveis e ícones (como o botão voltar)
        headerTintColor: theme.accent,
        // Configura o estilo visual do texto do título no cabeçalho
        headerTitleStyle: {
          fontWeight: "bold",
          color: theme.textLight,
        },
        // Remove a linha divisória (sombra) abaixo do cabeçalho para um visual flat
        headerShadowVisible: false,
      }}
    >
      {/* Tela Principal (Index): 
        Geralmente a listagem. Definida com 'headerShown: false' 
        provavelmente porque utiliza um cabeçalho customizado dentro da própria página.
      */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* Tela de Criação:
        Ativa o cabeçalho padrão com o título "Nova Tarefa".
      */}
      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          title: "Nova Tarefa",
          headerBackTitle: "Voltar", // Texto exibido ao lado da seta de voltar (iOS)
        }}
      />

      {/* Tela de Edição:
        Configurada para exibir o cabeçalho com contexto de alteração de dados.
      */}
      <Stack.Screen
        name="edit"
        options={{
          headerShown: true,
          title: "Editar Tarefa",
          headerBackTitle: "Voltar",
        }}
      />

      {/* Tela de Detalhes:
        Exibe informações aprofundadas de um item específico.
      */}
      <Stack.Screen
        name="details"
        options={{
          headerShown: true,
          title: "Detalhes",
        }}
      />
    </Stack>
  );
}
