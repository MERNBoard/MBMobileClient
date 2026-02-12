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

interface OptionSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function OptionSelector({
  label,
  options,
  selected,
  onSelect,
}: OptionSelectorProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const { theme, themeName } = useTheme();

  // --- LÓGICA DE CORES SINCRONIZADA ---
  const isDark = themeName === "dark" || theme.background === "#022C22";

  // Fundo do seletor usa o 'input' do tema
  const bgInput = theme.input || (isDark ? "#252525" : "#E8E8E8");

  // No Esmeralda, label amarelo. Nos outros, o accent.
  const labelColor =
    themeName === "esmeralda" ? theme.textPendente : theme.accent || "#60439f";

  // Cores do Modal
  const bgModal = theme.background || (isDark ? "#1A1A1A" : "#FFFFFF");
  const textColor = theme.textLight || (isDark ? "#FFF" : "#000");
  const accentColor = theme.accent || "#60439f";
  const borderColor = theme.detail || (isDark ? "#333" : "#eee");

  return (
    <View style={styles.container}>
      {/* Label com a cor dinâmica (Amarelo no Esmeralda) */}
      <Texto texto={label} style={{ color: labelColor, fontWeight: "bold" }} />

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
          {selected.replace("_", " ")}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
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
              <Text style={[styles.modalTitle, { color: labelColor }]}>
                Selecione {label}
              </Text>

              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    { borderBottomColor: borderColor },
                    selected === option && {
                      backgroundColor: accentColor + "25",
                    },
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: textColor },
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
