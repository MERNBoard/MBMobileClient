import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Texto } from "@/components/Text";
import { useTheme } from "../context/ThemeContext";

/**
 * Interface OptionSelectorProps
 * @param label - Texto descritivo exibido acima do seletor.
 * @param options - Lista de opções (strings) disponíveis para seleção.
 * @param selected - Valor atualmente selecionado.
 * @param onSelect - Função chamada ao escolher uma nova opção.
 */
interface OptionSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * Componente OptionSelector
 * Fornece uma interface de seleção customizada utilizando um Modal centralizado.
 */
export default function OptionSelector({
  label,
  options,
  selected,
  onSelect,
}: OptionSelectorProps) {
  // Estado para controlar a abertura/fechamento do Modal
  const [visible, setVisible] = useState<boolean>(false);

  // Consumo do contexto de tema para cores dinâmicas
  const { theme, themeName } = useTheme();

  // --- LÓGICA DE CORES SINCRONIZADA ---

  // Verifica se o tema atual deve ser tratado como Dark Mode
  const isDark = themeName === "dark" || theme.background === "#022C22";

  // Define a cor de fundo do campo de entrada (estilo original)
  const bgInput = theme.input || (isDark ? "#252525" : "#E8E8E8");

  /**
   * Cor do rótulo:
   * Aplica a cor de 'pendente' se o tema for "esmeralda",
   * caso contrário utiliza a cor de destaque (accent).
   */
  const labelColor =
    themeName === "esmeralda" ? theme.textPendente : theme.accent || "#60439f";

  // Variáveis de estilo extraídas do tema para o Modal
  const bgModal = theme.background || (isDark ? "#1A1A1A" : "#FFFFFF");
  const textColor = theme.textLight || (isDark ? "#FFF" : "#000");
  const accentColor = theme.accent || "#60439f";
  const borderColor = theme.detail || (isDark ? "#333" : "#eee");

  return (
    <View style={styles.container}>
      {/* Rótulo dinâmico do campo */}
      <Texto texto={label} style={{ color: labelColor, fontWeight: "bold" }} />

      {/* Botão Seletor: Exibe o valor selecionado e abre o modal */}
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: bgInput,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, { color: textColor }]}>
          {/* Formatação visual: troca underscore por espaço */}
          {selected.replace("_", " ")}
        </Text>
      </TouchableOpacity>

      {/* Modal de Opções */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        {/* Overlay: Fecha o modal ao clicar fora da área de conteúdo */}
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalWrapper}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: bgModal,
                  borderColor: borderColor,
                  borderWidth: 1,
                },
              ]}
            >
              {/* Título interno do Modal de seleção */}
              <Text style={[styles.modalTitle, { color: labelColor }]}>
                Selecione {label}
              </Text>

              {/* Renderização da lista de opções */}
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    { borderBottomColor: borderColor },
                    // Destaque visual suave se a opção estiver selecionada
                    selected === option && {
                      backgroundColor: accentColor + "25",
                    },
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false); // Fecha o modal após a escolha
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: textColor },
                      // Texto em negrito e cor de destaque para o item selecionado
                      selected === option && {
                        color: labelColor,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {option.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    width: "100%",
  },
  selector: {
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 15,
  },
  selectorText: {
    fontWeight: "600",
    fontSize: 14,
    textTransform: "uppercase",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalWrapper: {
    width: "100%",
    maxWidth: 400,
  },
  modalContent: {
    width: "100%",
    borderRadius: 35,
    padding: 25,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  option: {
    padding: 20,
    borderBottomWidth: 0.5,
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 16,
  },
});
