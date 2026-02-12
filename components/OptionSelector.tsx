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
 * Interface de Definição de Props
 * @param label - Título descritivo do seletor
 * @param options - Lista de strings com as opções de escolha
 * @param selected - A opção que está ativa no momento
 * @param onSelect - Função de callback disparada ao selecionar uma opção
 */
interface OptionSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * OptionSelector: Um componente de UI customizado que gerencia a seleção de opções
 * através de um Modal, garantindo consistência visual entre diferentes temas.
 */
export default function OptionSelector({
  label,
  options,
  selected,
  onSelect,
}: OptionSelectorProps) {
  // Estado para controlar a abertura/fechamento do Modal de opções
  const [visible, setVisible] = useState<boolean>(false);

  // Acesso ao contexto de tema para estilização dinâmica
  const { theme, themeName } = useTheme();

  // --- LÓGICA DE CORES SINCRONIZADA ---

  // Determina se o modo escuro está ativo com base no nome ou cor de fundo
  const isDark = themeName === "dark" || theme.background === "#022C22";

  // Define a cor de fundo do campo de seleção (Input)
  const bgInput = theme.input || (isDark ? "#252525" : "#E8E8E8");

  /**
   * Regra de Negócio Visual:
   * Se o tema for 'esmeralda', utiliza a cor de texto pendente (geralmente amarelo/laranja).
   * Caso contrário, utiliza a cor de destaque (accent) definida no tema.
   */
  const labelColor =
    themeName === "esmeralda" ? theme.textPendente : theme.accent || "#60439f";

  // Configurações cromáticas para os elementos internos do Modal
  const bgModal = theme.background || (isDark ? "#1A1A1A" : "#FFFFFF");
  const textColor = theme.textLight || (isDark ? "#FFF" : "#000");
  const accentColor = theme.accent || "#60439f";
  const borderColor = theme.detail || (isDark ? "#333" : "#eee");

  return (
    <View style={styles.container}>
      {/* Título do Campo */}
      <Texto texto={label} style={{ color: labelColor, fontWeight: "bold" }} />

      {/* Acionador do Seletor: Exibe o valor atual e abre o Modal ao ser pressionado */}
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
          {/* Formata a string removendo underscores para melhor legibilidade */}
          {selected.replace("_", " ")}
        </Text>
      </TouchableOpacity>

      {/* Modal de Opções: Renderizado sobre a interface atual */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        {/* Pressable Overlay: Permite fechar o modal ao tocar na área externa (backdrop) */}
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
              {/* Título interno do Modal */}
              <Text style={[styles.modalTitle, { color: labelColor }]}>
                Selecione {label}
              </Text>

              {/* Mapeamento das opções recebidas via Props */}
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    { borderBottomColor: borderColor },
                    // Aplica um destaque de fundo caso a opção seja a selecionada
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
                      // Estilização extra para o texto da opção ativa
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
    borderRadius: 24,
    padding: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
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
  },
  optionText: {
    fontSize: 16,
  },
});
