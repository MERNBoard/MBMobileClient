import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";

import {Title, Texto} from "@/components/Text"

/**
 * Props do componente OptionSelector
 * @param label - Título/legenda do seletor
 * @param options - Array com todas as opções disponíveis
 * @param selected - Valor atualmente selecionado
 * @param onSelect - Função callback chamada quando uma opção é selecionada
 */
interface OptionSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * Componente OptionSelector - Seletor de opções estilo dropdown/modal
 * Funcionalidades:
 * - Exibe valor selecionado em uma caixa
 * - Ao clicar, abre modal com todas as opções
 * - Opção selecionada fica destacada
 * - Fecha modal ao selecionar ou clicar fora
 */
export default function OptionSelector({
  label,
  options,
  selected,
  onSelect,
}: OptionSelectorProps) {
  // Controla visibilidade do modal (true = aberto, false = fechado)
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* Exibe o label/título do seletor */}
      <Texto texto={label}/>

      {/* Caixa principal do seletor - ao clicar abre o modal */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.selectorText}>{selected}</Text>
      </TouchableOpacity>

      {/* Modal com overlay transparente que cobre toda tela */}
      <Modal
        transparent // Mantém conteúdo da tela visível mas escurecido
        animationType="fade" // Animação suave de fade in/out
        visible={visible}
        onRequestClose={() => setVisible(false)} // Fecha se usuário apertar back button
      >
        {/* Overlay clicável - fecha modal ao clicar fora das opções */}
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          {/* Container centralizado do conteúdo do modal */}
          <View style={styles.modalContent}>
            {/* Título do modal */}
            <Text style={styles.modalTitle}>
              Escolha uma opção
            </Text>

            {/* Mapeia e renderiza cada opção disponível */}
            {options.map((option) => (
              <TouchableOpacity
                key={option} // Key única para performance do React
                style={[
                  styles.option,
                  selected === option && styles.selectedOption, // Estilo condicional para opção selecionada
                ]}
                onPress={() => {
                  // Chama callback do pai com nova opção E fecha modal
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected === option && styles.selectedText, // Texto destacado se selecionado
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 15, // Espaçamento entre seletores
  },

  selector: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15, // Espaço antes do modal
  },

  selectorText: {
    color: "#60439f", // Cor roxa principal
    fontWeight: "bold",
  },

  overlay: {
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)", 
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#60439f",
  },

  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", 
  },

  optionText: {
    fontSize: 16,
    color: "#000",
  },

  selectedOption: {
    backgroundColor: "#f3ecff", 
  },

  selectedText: {
    color: "#60439f",
    fontWeight: "bold",
  },
});
