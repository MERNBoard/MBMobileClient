import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../../constants/theme";
import { useTheme } from "../../../context/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme, themeName } = useTheme();
  const [view, setView] = useState<"menu" | "themes">("menu");

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    color = theme.textLight,
  }: any) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: theme.primary + "40" }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Octicons name={icon} size={22} color={theme.accent} />
        <View style={{ marginLeft: 15 }}>
          <Text style={[styles.menuItemTitle, { color }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.menuItemSubtitle, { color }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Octicons name="chevron-right" size={20} color={theme.accent} />
    </TouchableOpacity>
  );

  // --- VISÃO 1: MENU PRINCIPAL ---
  if (view === "menu") {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.headerTitle, { color: theme.textLight }]}>
          Configurações
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Personalização
          </Text>
          <MenuItem
            icon="eye"
            title="Temas e Cores"
            subtitle={`Atual: ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`}
            onPress={() => setView("themes")}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Conta
          </Text>
          <MenuItem
            icon="person"
            title="Informações do Usuário"
            onPress={() => alert("Em breve...")}
          />
          <MenuItem
            icon="shield-lock"
            title="Segurança"
            onPress={() => alert("Em breve...")}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Suporte
          </Text>
          <MenuItem
            icon="question"
            title="Ajuda e FAQ"
            onPress={() => alert("Em breve...")}
          />
          <MenuItem
            icon="info"
            title="Sobre o App"
            onPress={() => alert("Versão 1.0.0")}
          />
        </View>
      </ScrollView>
    );
  }

  // --- VISÃO 2: SELEÇÃO DE TEMAS ---
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setView("menu")}
      >
        <Octicons name="arrow-left" size={24} color={theme.accent} />
        <Text style={[styles.backText, { color: theme.accent }]}>Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: theme.textLight }]}>
        Temas
      </Text>
      <Text style={[styles.subtitle, { color: theme.textLight, opacity: 0.7 }]}>
        Selecione a paleta de cores do sistema:
      </Text>

      <View style={styles.grid}>
        {(Object.keys(Colors) as Array<keyof typeof Colors>).map((name) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.card,
              { backgroundColor: Colors[name].primary },
              themeName === name && {
                borderColor: Colors[name].accent,
                borderWidth: 2,
              },
            ]}
            onPress={() => setTheme(name)}
          >
            <View
              style={[styles.dot, { backgroundColor: Colors[name].accent }]}
            />
            <Text style={[styles.cardText, { color: Colors[name].textLight }]}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text
        style={[
          styles.sectionLabel,
          { color: theme.textLight, marginTop: 30, marginBottom: 10 },
        ]}
      >
        Prévia da Interface
      </Text>
      <View style={[styles.previewCard, { backgroundColor: theme.primary }]}>
        <View
          style={[styles.previewCircle, { backgroundColor: theme.accent }]}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              height: 10,
              width: "60%",
              backgroundColor: theme.textLight,
              borderRadius: 5,
              marginBottom: 6,
            }}
          />
          <View
            style={{
              height: 8,
              width: "40%",
              backgroundColor: theme.textLight,
              opacity: 0.4,
              borderRadius: 5,
            }}
          />
        </View>
        <View
          style={{
            width: 50,
            height: 25,
            backgroundColor: theme.accent,
            borderRadius: 5,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 32, fontWeight: "900", marginBottom: 20 },
  subtitle: { fontSize: 16, marginBottom: 25 },
  section: { marginBottom: 25 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 1,
  },

  // Menu Principal
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemTitle: { fontSize: 16, fontWeight: "600" },
  menuItemSubtitle: { fontSize: 12, opacity: 0.6 },

  // Subtela Temas
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  dot: { width: 14, height: 14, borderRadius: 7, marginBottom: 10 },
  cardText: { fontSize: 14, fontWeight: "600" },

  // Preview
  previewCard: {
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  previewCircle: { width: 35, height: 35, borderRadius: 18 },
});
