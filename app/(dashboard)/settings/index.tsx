import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../../components/CustomAlert";
import { Colors } from "../../../constants/theme";
import { useTheme } from "../../../context/ThemeContext";

/**
 * SettingsPage - Componente de Configurações.
 * Apresenta uma interface de navegação interna ("menu", "themes", "charts")
 * para gerenciar preferências sem sair da tela.
 */
export default function SettingsPage() {
  const { theme, setTheme, themeName, tipoGrafico, setTipoGrafico } =
    useTheme();

  // Controle de visualização interna (sub-telas)
  const [view, setView] = useState<"menu" | "themes" | "charts">("menu");
  const [alertVisible, setAlertVisible] = useState(false);

  // Mock de dados do usuário (Pode ser substituído por dados do context de Auth no futuro)
  const usuario = {
    nome: "Usuário Exemplo",
    email: "contato@exemplo.com",
    plano: "Premium",
  };

  /**
   * handleLogout: Inicia o fluxo de encerramento de sessão.
   */
  const handleLogout = () => {
    setAlertVisible(true);
  };

  /**
   * confirmLogout: Limpa o armazenamento persistente e redireciona.
   */
  const confirmLogout = async () => {
    try {
      setAlertVisible(false);
      // 1. Remove o Token e os dados do usuário do armazenamento local
      await AsyncStorage.multiRemove(["@MBToken", "user"]);

      // 2. Redireciona para a tela de autenticação usando replace
      // Isso limpa a pilha de navegação para impedir o "voltar".
      router.replace("/(auth)");
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao encerrar a sessão. Tente novamente.");
    }
  };

  /**
   * Componente Interno: MenuItem
   * Renderiza uma linha de opção padronizada para o menu de ajustes.
   */
  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    color = theme.textLight,
    showArrow = true,
  }: any) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: theme.primary + "30" }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.accent + "20" },
          ]}
        >
          {/* Lógica condicional para usar famílias de ícones diferentes se necessário */}
          {title === "Aparência" ? (
            <Ionicons name="color-palette" size={20} color={theme.accent} />
          ) : (
            <Octicons name={icon} size={20} color={theme.accent} />
          )}
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={[styles.menuItemTitle, { color }]}>{title}</Text>
          {subtitle && (
            <Text
              style={[
                styles.menuItemSubtitle,
                { color: theme.textLight, opacity: 0.6 },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Octicons name="chevron-right" size={18} color={theme.accent} />
      )}
    </TouchableOpacity>
  );

  // VIEW: MENU PRINCIPAL
  if (view === "menu") {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.headerTitle, { color: theme.textLight }]}>
          Ajustes
        </Text>

        {/* Seção: Perfil do Usuário */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Sua Conta
          </Text>
          <View
            style={[
              styles.profileCard,
              { backgroundColor: theme.primary + "40" },
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
              <Text
                style={{
                  color: theme.background,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                {usuario.nome.charAt(0)}
              </Text>
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={[styles.profileName, { color: theme.textLight }]}>
                {usuario.nome}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.textLight }]}>
                {usuario.email}
              </Text>
              <View
                style={[styles.badge, { backgroundColor: theme.accent + "30" }]}
              >
                <Text
                  style={{
                    color: theme.accent,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {usuario.plano}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => alert("Editar Perfil")}>
              <Octicons name="pencil" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção: Customização Visual */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Customização
          </Text>
          <MenuItem
            icon="color-mode"
            title="Aparência"
            subtitle={`Tema: ${themeName}`}
            onPress={() => setView("themes")}
          />
          <MenuItem
            icon="graph"
            title="Visualização de Dados"
            subtitle={`Estilo: ${tipoGrafico}`}
            onPress={() => setView("charts")}
          />
        </View>

        {/* Seção: Segurança e Saída */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Segurança
          </Text>
          <MenuItem icon="shield-lock" title="Privacidade" onPress={() => {}} />
          <MenuItem
            icon="sign-out"
            title="Sair da Conta"
            color="#ff5555"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>

        <CustomAlert
          visible={alertVisible}
          title="Sair da Conta"
          message="Tem certeza que deseja encerrar sua sessão?"
          onConfirm={confirmLogout}
          onCancel={() => setAlertVisible(false)}
          confirmText="Sair"
          cancelText="Cancelar"
          type="danger"
        />
      </ScrollView>
    );
  }

  // VIEW: SELEÇÃO DE TIPO DE GRÁFICO (Estilo de visualização de dados)
  if (view === "charts") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, padding: 0 },
        ]}
      >
        <View style={styles.stickyHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setView("menu")}
          >
            <Octicons name="arrow-left" size={24} color={theme.accent} />
            <Text style={[styles.backText, { color: theme.accent }]}>
              Voltar
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.textLight, marginBottom: 5 },
            ]}
          >
            Gráficos
          </Text>
          <Text style={{ color: theme.textLight, opacity: 0.7, fontSize: 14 }}>
            O estilo escolhido será aplicado à sua Dashboard principal.
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.grid}>
            {[
              { id: "pizza_donut", label: "Rosquinha" },
              { id: "pizza_solid", label: "Pizza Fatias" },
              { id: "barra_vertical", label: "Vertical" },
              { id: "barra_lateral", label: "Horizontal" },
              { id: "linhas", label: "Linhas" },
              { id: "area", label: "Área" },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.chartCard,
                  {
                    backgroundColor: theme.primary + "20",
                    borderColor: theme.accent + "30",
                    borderWidth: 1.5,
                  },
                  tipoGrafico === item.id && {
                    borderColor: theme.accent,
                    borderWidth: 2,
                    backgroundColor: theme.primary + "60",
                  },
                ]}
                onPress={() => setTipoGrafico(item.id as any)}
              >
                <View style={styles.previewBox}>
                  {/* Renderização dinâmica do ícone baseada no ID do gráfico */}
                  {item.id === "pizza_donut" && (
                    <Entypo
                      name="circular-graph"
                      size={30}
                      color={theme.accent}
                    />
                  )}
                  {item.id === "pizza_solid" && (
                    <Foundation
                      name="graph-pie"
                      size={30}
                      color={theme.accent}
                    />
                  )}
                  {item.id === "barra_vertical" && (
                    <Foundation
                      name="graph-bar"
                      size={30}
                      color={theme.accent}
                    />
                  )}
                  {item.id === "barra_lateral" && (
                    <Foundation
                      name="graph-horizontal"
                      size={30}
                      color={theme.accent}
                    />
                  )}
                  {item.id === "linhas" && (
                    <SimpleLineIcons
                      name="graph"
                      size={30}
                      color={theme.accent}
                    />
                  )}
                  {item.id === "area" && (
                    <Entypo name="area-graph" size={30} color={theme.accent} />
                  )}
                </View>
                <Text style={[styles.cardText, { color: theme.textLight }]}>
                  {item.label}
                </Text>
                {tipoGrafico === item.id && (
                  <Octicons
                    name="check-circle-fill"
                    size={16}
                    color={theme.accent}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // VIEW: SELEÇÃO DE TEMAS (Aparência)
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, padding: 0 },
      ]}
    >
      <View
        style={[
          styles.stickyHeader,
          { borderBottomWidth: 1, borderBottomColor: theme.primary + "50" },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setView("menu")}
        >
          <Octicons name="arrow-left" size={24} color={theme.accent} />
          <Text style={[styles.backText, { color: theme.accent }]}>Voltar</Text>
        </TouchableOpacity>

        {/* Card de Preview: Mostra em tempo real como o tema se comporta */}
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
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.grid}>
          {/* Mapeia todos os temas disponíveis no arquivo de constantes */}
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
              <Text
                style={[styles.cardText, { color: Colors[name].textLight }]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  stickyHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    zIndex: 10,
  },
  headerTitle: { fontSize: 32, fontWeight: "900", marginBottom: 25 },
  section: { marginBottom: 30 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 15,
    letterSpacing: 1.2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: { padding: 8, borderRadius: 10 },
  menuItemTitle: { fontSize: 15, fontWeight: "600" },
  menuItemSubtitle: { fontSize: 12 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: { fontSize: 18, fontWeight: "bold" },
  profileEmail: { fontSize: 13, opacity: 0.6, marginBottom: 4 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },
  previewCircle: { width: 35, height: 35, borderRadius: 20 },
  chartCard: {
    width: "48%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    position: "relative",
    marginBottom: 12,
  },
  previewBox: { height: 50, justifyContent: "center", marginBottom: 10 },
  checkIcon: { position: "absolute", top: 8, right: 8 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  dot: { width: 14, height: 14, borderRadius: 7, marginBottom: 10 },
  cardText: { fontSize: 15, fontWeight: "600" },
});
